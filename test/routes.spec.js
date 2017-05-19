process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../server');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Everything', () => {
  beforeEach((done) => {
    database.migrate.latest()
      .then(() => {
        return database.seed.run();
      })
      .then(() => {
        done();
      });
  });

  afterEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  describe('Client Routes', () => {
    it('should return the homepage with test', (done) => {
      chai.request(server)
        .get('/')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.html;
          done();
        });
    });

    it('should return 404 for a non existent route', (done) => {
      chai.request(server)
        .get('/quizzes/sad')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('Check endpoints', () => {
    describe('GET /api/v1/quizzes', () => {
      it('should return all of the quizzes', (done) => {
        chai.request(server)
          .get('/api/v1/quizzes')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(2);
            response.body[0].should.have.property('title');
            done();
          });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
          .get('/api/v1/sad')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/query', () => {
      it('should return all question and answers', (done) => {
        chai.request(server)
          .get('/api/v1/query')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(4);
            response.body[0].should.have.property('question');
            response.body[0].question.should.equal('is this a test?');
            response.body[0].should.have.property('answer');
            response.body[0].answer.should.equal('true');
            done();
          });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
          .get('/api/v1/sadquery')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/quizzes/:quiz_id/query', () => {
      it.skip('should return specific quiz', (done) => {
        chai.request(server)
          .get('/api/v1/quizzes/1/query')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(2);
            response.body[0].should.have.property('question');
            response.body[0].question.should.equal('is this a test?');
            done();
          });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
          .get('/api/v1/folders/1/urlscddd')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/query/:id', () => {
      it.skip('should return specific question', (done) => {
        // different ID each timeeeee
        chai.request(server)
          .get('/api/v1/query/1')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body[0].should.have.property('question');
            response.body[0].question.should.equal('is this a test?');
            done();
          });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
          .get('/api/v1/query/1/lol')
          .end((error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('POST /api/v1/quizzes', () => {
      it('should create new quiz', (done) => {
        chai.request(server)
          .post('/api/v1/quizzes')
          .send({
            title: 'Suh Questions',
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.be.a('object');
            response.body.should.have.property('title');
            response.body.title.should.equal('Suh Questions');
            chai.request(server)
              .get('/api/v1/quizzes')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(3);
                res.body[2].should.have.property('title');
                res.body[2].title.should.equal('Suh Questions');
                done();
              });
          });
      });

      it('should not create a record with missing data', (done) => {
        chai.request(server)
          .post('/api/v1/quizzes')
          .send({})
          .end((err, response) => {
            response.should.have.status(422);
            response.body.error.should.equal('You are missing a title!');
            done();
          });
      });
    });

    describe('POST /api/v1/quizzes/:quiz_id/query', () => {
      it('should create new question', (done) => {
        chai.request(server)
          .post('/api/v1/quizzes/1/query')
          .send({
            question: 'Suh Questions',
            answer: 'dudee',
            quiz_id: 1,
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.be.a('array');
            response.body[2].should.have.property('question');
            response.body[2].question.should.equal('Suh Questions');
            response.body[2].should.have.property('answer');
            response.body[2].answer.should.equal('dudee');
            response.body[2].should.have.property('quiz_id');
            response.body[2].quiz_id.should.equal(1);
            response.body[2].should.have;
            chai.request(server)
              .get('/api/v1/quizzes/1/query')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[2].should.have.property('question');
                res.body[2].question.should.equal('Suh Questions');
                done();
              });
          });
      });

      it('should not create a record with missing data', (done) => {
        chai.request(server)
          .post('/api/v1/quizzes')
          .send({})
          .end((err, response) => {
            response.should.have.status(422);
            response.body.error.should.equal('You are missing a title!');
            done();
          });
      });
    });

    describe('DELETE /api/v1/query/:id', () => {
      it.skip('should delete question/answer by id', (done) => {
        chai.request(server)
          .delete('/api/v1/query/1')
          .end((error, response) => {
            response.should.have.status(204);
            chai.request(server)
              .get('/api/v1/query')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.equal(1);
                res.body[0].should.have.property('question');
                res.body[0].question.should.equal('is this a test?');
                done();
              });
          });
      });

      it.skip('should return error when no question to delete', (done) => {
        chai.request(server)
          .delete('/api/v1/query/sad')
          .end((error, response) => {
            response.should.have.status(404);
            response.error.text.should.equal('nothing deleted');
            done();
          });
      });

      it('should return error when not logged in', (done) => {
        chai.request(server)
          .delete('/api/v1/quizzes/10')
          .end((error, response) => {
            response.should.have.status(403);
            response.error.text.should.equal('{"success":false,"message":"You must be authorized to hit this endpoint"}');
            done();
          });
      });
    });

    describe('DELETE /api/v1/quizzes/:id', () => {
      it.skip('should be able to DELETE a specific quiz', (done) => {
        chai.request(server)
        .get('/api/v1/quizzes')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.body.length.should.equal(2);
          chai.request(server)
          .delete('/api/v1/quizzes/2')
          .set('Authorization', process.env.TOKEN)
          .end((err, response) => {
            response.should.have.status(204);
            chai.request(server)
            .get('/api/v1/quizzes')
            .set('Authorization', process.env.TOKEN)
            .end((err, response) => {
              response.body.length.should.equal(1);
              done();
            });
          });
        });
      });

      it.skip('should return error when no quiz to delete', (done) => {
        chai.request(server)
          .delete('/api/v1/query/3sdf')
          .end((error, response) => {
            response.should.have.status(404);
            response.error.text.should.equal('no go');
            done();
          });
      });

      it('should return error when not logged in', (done) => {
        chai.request(server)
          .delete('/api/v1/query/3sdf')
          .end((error, response) => {
            response.should.have.status(403);
            response.error.text.should.equal('{"success":false,"message":"You must be authorized to hit this endpoint"}');
            done();
          });
      });
    });
  });
});
