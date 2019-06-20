/* eslint-env node, mocha */
process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')

const path = require('path')
const {expect} = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

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

  after(async () => { await actionhero.stop() })

  it('knex should be in api scope', async () => {
    expect(api.knex).to.exist
  })
})
