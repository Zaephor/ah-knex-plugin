exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('migration_test', function (table) {
      table.increments('id').primary()
      table.uuid('uuid').unique().notNullable()

      table.timestamps(true, true)
    })
    .dropTable('migration_test')
}
exports.down = exports.up
// exports.down = function (knex, Promise) {
//   return knex.schema
//     .dropTable('migration_test')
// }
