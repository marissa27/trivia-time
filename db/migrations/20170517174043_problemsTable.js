exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('query',
      function(table) {
        table.increments('id').primary();
        table.string('question');
        table.string('answer');
        table.integer('quiz_id').unsigned();
        table.foreign('quiz_id')
          .references('quizzes.id');

        table.timestamps(true, true);
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('query')
    ]);
};
