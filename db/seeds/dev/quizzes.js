'use strict';
var quizzes = require('../../../data.json');

exports.seed = function(knex, Promise) {
  return knex('query').del()
    .then(() => knex('quizzes').del())
    .then(() => {
      var quizPromises = [];
      quizzes.results.forEach(function(quiz){
        quizPromises.push(createQuiz(knex, quiz));
      });

      return Promise.all(quizPromises);
  });
};

function createQuiz(knex, quiz) {
  return knex.table('quizzes')
    .returning('id')
    .insert(
    {
      title: 'History Quiz'
    }
  )

      .then(function(queryIds){
        return knex('query')
          .insert(
          {
            question: quiz.question,
            answer: quiz.correct_answer,
            quiz_id: queryIds[0]
          }
        );
    });
  }
