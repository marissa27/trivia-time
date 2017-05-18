exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('answers'),
    knex.schema.dropTable('questions')
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('questions',
      function(table) {
        table.increments('id').primary();
        table.string('question');
        table.integer('quiz_id').unsigned();
        table.foreign('quiz_id')
          .references('quizzes.id');

        table.timestamps();
      }),

      knex.schema.createTable('answers',
        function(table) {
          table.increments('id').primary();
          table.string('answer');
          table.integer('question_id').unsigned();
          table.foreign('question_id')
            .references('questions.id');

          table.timestamps();
        })
  ]);
};
