'use strict'
const { Initializer, api } = require('actionhero')
const path = require('path')
const fs = require('fs')

let config = ((api.config && api.config['ah-knex-plugin'])) ? api.config['ah-knex-plugin'] : require(path.join(__dirname, '..', 'config', 'ah-knex-plugin.js'))[process.env.NODE_ENV || 'development']['ah-knex-plugin'](api)

module.exports = class KnexInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'ah-knex-plugin'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.log('[' + this.loadPriority + '] ' + this.name + ': Initializing')

    // Find migration directories and add them to the config object
    for (let pluginName in api.config.plugins) {
      if (api.config.plugins[pluginName].migrations !== false) {
        let pluginPath = api.config.plugins[pluginName].path
        if (fs.existsSync(path.join(pluginPath, 'migrations'))) {
          if (!config.migrations) { config.migrations = {} }
          if (!config.migrations.directory) { config.migrations.directory = [] }
          config.migrations.directory.push(path.join(pluginPath, 'migrations'))
        }
      }
    }
    api.knex = require('knex')(config)
    api.knex.migrate.latest([config])
  }
}
