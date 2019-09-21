/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const fs = require('fs')
const path = require('path')
const {expect} = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')
const config = require(path.join(__dirname, '..', 'config', 'ah-knex-plugin.js'))
const environment = (process.env.NODE_ENV && config[process.env.NODE_ENV]) ? process.env.NODE_ENV : 'default'
let api

describe('ah-knex-plugin', () => {
  const configChanges = {
    'ah-knex-plugin': config[environment]['ah-knex-plugin'](ActionHero.api),
    plugins: {
      'ah-knex-plugin': {path: path.join(__dirname, '..')}
    }
  }

  before(async () => {
    // configChanges['ah-knex-plugin'].migrations.directory = [path.join(configChanges.plugins['ah-knex-plugin'].path, 'migrations')]
    api = await actionhero.start({configChanges})
  })

  after(async () => {
    await actionhero.stop()
    // Cleanup sqlite3 file
    if (fs.existsSync(configChanges['ah-knex-plugin'].connection.filename)) { fs.unlinkSync(configChanges['ah-knex-plugin'].connection.filename) }
  })

  it('ActionHero server launches', () => {
    expect(api.running).to.equal(true)
  })

  it('knex should be in api scope', async () => {
    expect(api.knex).to.exist
  })

  it('migration directory was detected', async () => {
    expect(api.config['ah-knex-plugin'].migrations.directory).contains(path.join(configChanges.plugins['ah-knex-plugin'].path, 'migrations'))
  })
  it('migrations have run', async () => {
    expect(await api.knex.migrate.currentVersion([configChanges['ah-knex-plugin']])).to.equal('0000')
  })
})
