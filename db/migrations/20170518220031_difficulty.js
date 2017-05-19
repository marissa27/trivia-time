
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('query', function (table) {
      table.string('difficulty');
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('query', function (table) {
      table.string('difficulty');
    })
  ]);
};
