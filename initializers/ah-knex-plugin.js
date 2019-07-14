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

    // Find migration directories and add them to the config object
    for (const pluginName in api.config.plugins) {
      if (api.config.plugins[pluginName].migrations !== false) {
        const pluginPath = api.config.plugins[pluginName].path
        if (fs.existsSync(path.join(pluginPath, 'migrations'))) {
          if (!config.migrations) { config.migrations = {} }
          if (!config.migrations.directory) { config.migrations.directory = [] }
          config.migrations.directory.push(path.join(pluginPath, 'migrations'))
        }
      }
    }
    api.knex = require('knex')(config)
    if (config.migrations.directory) {
      api.knex.migrate.latest([config])
    }
  }
}
