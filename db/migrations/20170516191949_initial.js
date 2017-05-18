exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('quizzes',
      function(table) {
        table.increments('id').primary();
        table.string('title');

        table.timestamps(true, true);
        }),

    knex.schema.createTable('questions',
      function (table) {
        table.increments('id').primary();
        table.string('question');
        table.integer('quiz_id').unsigned();
        table.foreign('quiz_id')
          .references('quizzes.id');

        table.timestamps();
      }),

      knex.schema.createTable('answers',
        function (table) {
          table.increments('id').primary();
          table.string('answer');
          table.integer('question_id').unsigned();
          table.foreign('question_id')
            .references('questions.id');

          table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.scheme.dropTable('quizzes'),
    knex.scheme.dropTable('questions'),
    knex.scheme.dropTable('answers')
  ]);
};
