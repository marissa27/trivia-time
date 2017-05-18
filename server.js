const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Trivia Time';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
});

// GET
app.get('/api/v1/quizzes', (request, response) => {
  database('quizzes').select()
  .then(quizzes => response.status(200).json(quizzes))
  .catch(error => console.error('error: ', error))
});

app.get('/api/v1/query', (request, response) => {
  database('query').select()
  .then(query => response.status(200).json(query))
  .catch(error => console.error('error: ', error))
});

app.get('/api/v1/quizzes/:quiz_id/query', (request, response) => {
  database('query').where('quiz_id', request.params.quiz_id).select()
    .then(query => {
      response.status(200).json(query);
    })
    .catch(error => {
      console.error('error: ', error)
    })
});

app.get('/api/v1/query/:id', (request, response) => {
  database('query').where('id', request.params.id).select()
  .then(query => {
    response.status(200).json(query);
  })
  .catch(error => {
    console.error('error: ', error)
  });
});

// POST
app.post('/api/v1/quizzes', (request, response) => {
  const quiz = request.body;
  const title = request.body.title;

  if (!title) {
    response.status(422).send({
      error: 'You are missing a title!'
    })
  } else {
    database('quizzes').insert(quiz, 'id')
    .then(quiz => {
        response.status(201).json({ id: quiz[0], title: title })
    })
    .catch(error => {
      console.error('error: ', error);
    })
  }
});

app.post('/api/v1/quizzes/:quiz_id/query', (request, response) => {
  const query = request.body;
  const queryObj = {
    question: request.body.question,
    answer: request.body.answer,
    quiz_id: request.params.quiz_id,
  };
  if (!queryObj.question) {
    response.status(422).send({
      error: 'How can we ask a question without a question? (Direct quote from Socrates)'
    })
  } else if (!queryObj.answer) {
    response.status(422).send({
      error: 'Not much of a quiz without an answer - please resubmit.'
    })
  } else {
    database('query').insert(queryObj)
    .then(() => {
      database('query').where('quiz_id', request.params.quiz_id).select()
        .then(query => {
          response.status(201).json(query);
        })
        .catch(error => {
        console.error('error: ', error);
        });
    });
  }
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log('Your app is running!');
  });
}

module.exports = app;
