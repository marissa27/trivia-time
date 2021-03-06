const quizzes = require('../../../data.json');

function createQuestions(knex, quiz) {
  return knex('query')
    .insert({
      question: quiz.question,
      answer: quiz.correct_answer,
      quiz_id: quiz.id,
      difficulty: quiz.difficulty,
    });
}

exports.seed = function (knex, Promise) {
  return knex('query').del()
    .then(() => knex('quizzes').del())
    .then(() => {
      return Promise.all([
        knex.table('quizzes')
          .insert([
            {
              title: 'History Quiz',
              id: 1,
            },
            {
              title: 'History Quiz 2',
              id: 2,
            },
            {
              title: 'History Quiz 3',
              id: 3,
            },
          ]),
      ]);
    })
  .then(() => {
    const questionPromise = [];

    quizzes.results.forEach((quiz) => {
      questionPromise.push(createQuestions(knex, quiz));
    });
    return Promise.all(questionPromise);
  })
  .catch((error) => {
    console.log(error)
  });
};
