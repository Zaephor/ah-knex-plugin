/* eslint-env node, mocha */
const path = require('path')

process.env.PROJECT_ROOT = path.join(__dirname, '..', 'node_modules', 'actionhero')

const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()
let api

describe('ah-knex-plugin', () => {
  before(async () => {
    let configChanges = {
      'ah-knex-plugin': { },
      plugins: {
        'ah-knex-plugin': { path: path.join(__dirname, '..') }
      }
    }
    api = await actionhero.start({ configChanges })
  })

  after(async () => { await actionhero.stop() })
})
