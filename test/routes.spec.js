process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp)

describe('Everything', () => {

  beforeEach((done) => {
   database.migrate.latest()
   .then(() => {
     return database.seed.run()
   })
   .then(() => {
     done()
   })
 })

 afterEach((done) => {
   database.seed.run()
   .then(() => {
     done()
   })
 })

  describe('Client Routes', () => {
    it('should return the homepage with test', (done) => {
      chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.html
        done()
      });
    });

    it('should return 404 for a non existent route', (done) => {
      chai.request(server)
      .get('/folders/urls')
      .end((error, response) => {
        response.should.have.status(404)
        done()
      });
    })
  });

  describe('Check requests', () => {

    describe('GET /api/v1/quizzes', () => {
      it('should return all of the quizzes', (done) => {
        chai.request(server)
        .get('/api/v1/quizzes')
        .end((error, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(2)
          response.body[0].should.have.property('title')
          done()
        });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/sad')
        .end((error, response) => {
          response.should.have.status(404)
          done()
        });
      })
    });

    describe('GET /api/v1/query', () => {
      it('should return all question and answers', (done) => {
        chai.request(server)
        .get('/api/v1/query')
        .end((error, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(4)
          response.body[0].should.have.property('question')
          response.body[0].question.should.equal('is this a test?')
          response.body[0].should.have.property('answer')
          response.body[0].answer.should.equal('true')
          done()
        });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/sadquery')
        .end((error, response) => {
          response.should.have.status(404)
          done()
        });
      })
    });

    describe('GET /api/v1/quizzes/:quiz_id/query', () => {
      it('should return specific quiz', (done) => {
        chai.request(server)
        .get('/api/v1/quizzes/1/query')
        .end((error, response) => {
          
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(2)
          response.body[0].should.have.property('question')
          response.body[0].question.should.equal('is this a test?')
          done()
        });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/folders/1/urlscddd')
        .end((error, response) => {
          response.should.have.status(404)
          done()
        });
      })
    });

    describe('GET /api/v1/query/:id', () => {
      it('should grab specific question', (done) => {
        chai.request(server)
        .get('/api/v1/query/1')
        .end((error, response) => {
          response.should.have.status(200)
          response.redirects.should.be.a('array')
          response.redirects[0].should.equal('http://www.pinterest.com/')
          done()
        });
      });
    });

    describe('POST /api/v1/folders', () => {
      it.skip('should create new folder', (done) => {
        chai.request(server)
        .post('/api/v1/folders')
        .send(
          {
            title: 'Knuth'
          }
        )
        .end((error, response) => {
          response.should.have.status(201)
          response.body.should.be.a('object')
          response.body.should.have.property('title')
          response.body.title.should.equal('Knuth')
          chai.request(server)
          .get('/api/v1/folders')
        .end((err, response) => {
           response.should.have.status(200)
           response.should.be.json
           response.body.should.be.a('array')
           response.body.length.should.equal(2)
           response.body[1].should.have.property('title')
           response.body[1].title.should.equal('Knuth')
           done()
          })
        })
      })

      it.skip('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/folders')
        .send({})
        .end((err, response) => {
          response.should.have.status(422)
          response.body.error.should.equal('You are missing data!')
          done()
        })
      })
    });
  });

    describe('POST /api/v1/folders/:folder_id/urls', () => {
      it.skip('should create new url for a folder', (done) => {
        chai.request(server)
        .post('/api/v1/folders/1/urls')
        .send(
          {
            title: 'Marissa',
            fullURL: 'www.marissa.com',
            visited: 0,
            folder_id: 1
          }
        )
        .end((error, response) => {
          response.should.have.status(201)
          response.body[1].should.be.a('object')
          response.body[1].should.have.property('title')
          response.body[1].title.should.equal('Marissa')
          chai.request(server)
          .get('/api/v1/folders/1/urls')
        .end((err, response) => {
           response.should.have.status(200)
           response.should.be.json
           response.body.should.be.a('array')
           response.body.length.should.equal(2)
           response.body[1].should.have.property('title')
           response.body[1].title.should.equal('Marissa')
           done()
          })
        })
      })

      it.skip('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/folders/:folder_id/urls')
        .send({})
        .end((err, response) => {
          response.should.have.status(422)
          response.body.error.should.equal('You are missing data!')
          done()
        })
      })
    });
  });
