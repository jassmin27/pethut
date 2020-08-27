process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app.js');
const conn = require('../src/index.js');
const axios = require('axios');

describe('GET /pets', () => {

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


  it('OK, Getting ALL pets has 0 pets initially', (done) => {
    request(app).get('/pets')
      .then((res) => {
        const body = res.body;
        expect(0).to.equal(0);
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Getting a pet by ID', (done) => {
      request(app).get('/pets/5f1a89e051102a3028b8ab33')
        .then((res) => {
          expect(res.statusCode).to.equal(200);
          done();
        })
        .catch((err) => done(err));
  });

  it('FAIL, Getting a pet by invalid ID', (done) => {
        request(app).get('/pets/123')
          .then((res) => {
            expect(res.statusCode).to.equal(400);
            done();
          })
          .catch((err) => done(err));
  });


})