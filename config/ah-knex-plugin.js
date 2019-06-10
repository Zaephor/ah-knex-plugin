'use strict'

exports['default'] = {
  'ah-knex-plugin': (api) => {
    // Essentially standard knex connection
    return {
      /* Sqlite3
      client: 'sqlite3',
      connection: {
        filename: './mydb.sqlite'
      }
       */
      /* MySQL/MariaDB
      client: 'mysql',
      connection: process.env.DATABASE_URL || 'mysql://user:password@ip:port/dbname',
      pool: {
        min: 2,
        max: 10
      },
       */
      /* Postgres DB
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://user:password@ip:port/dbname',
      pool: {
        min: 2,
        max: 10
      },
       */
      client: 'sqlite3',
      connection: {
        filename: './mydb.sqlite'
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }
  }
}
