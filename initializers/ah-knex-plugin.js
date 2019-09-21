'use strict'
const { Initializer, api } = require('actionhero')
const path = require('path')
const fs = require('fs')

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
        if (fs.existsSync(path.join(pluginPath, 'migrations'))) {
          if (!config.migrations) { config.migrations = {} }
          if (!config.migrations.directory) { config.migrations.directory = [] }
          config.migrations.directory.push(path.join(pluginPath, 'migrations'))

          // TODO: Figure out how to change up the `knex_migrations` schema for per-plugin migrations
          // config.migrations.directory = [path.join(pluginPath, 'migrations')]
          // await api.knex.migrate.latest([config])
        }
      }
    }

    if (config.migrations.directory) {
      await api.knex.migrate.latest([config])
    }
  }
}
