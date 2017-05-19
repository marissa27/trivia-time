exports.seed = function (knex, Promise) {
  return knex('query').del()
    .then(() => knex('quizzes').del())
    .then(() => {
      return Promise.all([
        knex.table('quizzes')
          .insert([
            {
              title: 'Test Quiz 1',
              id: 1,
            },
            {
              title: 'Test Quiz 2',
              id: 2,
            },
          ]),
      ]);
    })
  .then(() => {
    return Promise.all([
      knex.table('query')
      .insert([
        {
          id: 1,
          question: 'is this a test?',
          answer: 'true',
          quiz_id: 1,
        },
        {
          id: 2,
          question: 'is Pam the coolest',
          answer: 'true',
          quiz_id: 1,
        },
        {
          id: 3,
          question: 'do I have a question?',
          answer: 'false',
          quiz_id: 2,
        },
        {
          id: 4,
          question: 'is a question a question?',
          answer: 'true',
          quiz_id: 2,
        },
      ]),
    ]);
  })
  .catch((error) => {
    error.status(403).send({
      error: 'No questions here.',
    });
  });
};
