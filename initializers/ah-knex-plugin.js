'use strict'
const { Initializer, api } = require('actionhero')
const path = require('path')
const fs = require('fs')
const Umzug = require('umzug')

module.exports = class KnexInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'ah-knex-plugin'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    if (api.config && !api.config[this.name]) {
      api.config[this.name] = require(path.join(api.config.plugins[this.name].path, 'config', this.name + '.js'))[process.env.NODE_ENV || 'default'][this.name](api)
    }
    const config = api.config[this.name]

    api.log('[' + this.loadPriority + '] ' + this.name + ': Initializing')

    api.knex = await require('knex')(config)

    // Iterate over each plugin in api.config.plugins
    for (const pluginName in api.config.plugins) {
      if (api.config.plugins[pluginName].migrations !== false) {
        const pluginPath = api.config.plugins[pluginName].path

        // Check if there is a migrations folder in the plugin
        if (fs.existsSync(path.join(pluginPath, 'migrations'))) {
          if (!api.knex.migrations) { api.knex.migrations = {} }

          // Build umzug object
          api.knex.migrations[pluginName] = new Umzug({
            storage: 'knex-umzug',
            storageOptions: {
              context: pluginName,
              connection: api.knex,
              tableName: config.migrations.tableName || 'knex_migrations'
            },
            migrations: {
              params: [
                api.knex,
                Promise
              ],
              path: path.join(pluginPath, 'migrations'),
              pattern: /^\d+[\w-]+\.js$/
            }
          })

          // Check for any pending migrations in plugin context
          if (
            (await api.knex.migrations[pluginName].pending()).length > 0 &&
            (await api.cache.lock(this.name + ':migrationActive', (1000 * 120))) === true
          ) {
            api.log('[' + this.startPriority + '] ' + this.name + ': Executing pending migrations for ' + this.name)
            await api.knex.migrations[pluginName].up()
            await api.cache.unlock(this.name + ':migrationActive')
          }
        }
      }
    }
  }
}
