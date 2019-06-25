/* eslint-env node, mocha */
const fs = require('fs')
const path = require('path')
const {expect} = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')
let config = require(path.join(__dirname, '..', 'config', 'ah-knex-plugin.js'))
let environment = (process.env.NODE_ENV && config[process.env.NODE_ENV]) ? process.env.NODE_ENV : 'default'
let api

describe('ah-knex-plugin', () => {
  let configChanges = {
    'ah-knex-plugin': config[environment]['ah-knex-plugin'](ActionHero.api),
    plugins: {
      'ah-knex-plugin': {path: path.join(__dirname, '..')}
    }
  }

  before(async () => {
    api = await actionhero.start({configChanges})
  })

  after(async () => {
    await actionhero.stop()
    if (fs.existsSync(configChanges['ah-knex-plugin'].connection.filename)) { fs.unlinkSync(configChanges['ah-knex-plugin'].connection.filename) }
  })

  it('ActionHero server launches', () => {
    expect(api.running).to.equal(true)
  })

  it('knex should be in api scope', async () => {
    expect(api.knex).to.exist
  })

  it('should validate that migrations can be detected')
  it('should validate that migrations can be run')
})
