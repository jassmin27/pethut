process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app.js');
const conn = require('../src/index.js');
const axios = require('axios');

describe('GET /query/:id', () => {

  before((done) => {
      conn.connect()
         .then(() => done())
         .catch((err) => done(err));
  });

  after((done) => {
      conn.close()
         .then(() => {
            done();
         })
         .catch((err) => done(err));
  })


  it('OK, Getting query by valid Owner ID works', (done) => {
    request(app).get('/query/5f1a8750bb8fcb4820068a69')
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });

  it('FAIL, Getting query by invalid Owner ID does not work', (done) => {
      request(app).get('/query/123')
        .then((res) => {
          expect(res.statusCode).to.equal(404);
          done();
        })
        .catch((err) => done(err));
    });

})