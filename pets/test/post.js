process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app.js');
const conn = require('../src/index.js');
const axios = require('axios');
const fs = require('fs');

describe('POST /owners/:id/pets', () => {

  before((done) => {
      conn.connect()
         .then(() => done())
         .catch((err) => done(err));
  });

  after((done) => {
      conn.close()
         .then(() => done())
         .catch((err) => done(err));
  })


  it('OK, Creating a new pet works', (done) => {
    request(app).post('/owners/5f1a8750bb8fcb4820068a69/pets')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .field('name', 'Jack')
       .field('breed', 'Spaniel')
       .field('gender', 'Male')
       .field('age', '5')
       .field('vaccinated', true)
       .field('description', 'A friendly dog..')
       .attach('image',fs.readFileSync('uploads/test-dog.jpg'),'test-dog.png')
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        console.log("PET ID : " + res.body.pet._id);
        //done();

        axios.delete('http://localhost:5001/owners/5f1a8750bb8fcb4820068a69/pets/' + res.body.pet._id)
           .then((res) => done())
           .catch(err => done(err));

      })
      .catch((err) => done(err));
  });

    it('FAIL, Pet is not created if owner does not exist', (done) => {
      request(app).post('/owners/123/pets')
        .send({
             name: 'Jack',
             breed: 'Spaniel',
             gender: 'Male',
             age: '5',
             vaccinated: true,
             description: 'A friendly dog..'
          })
          .then((res) => {
            expect(res.statusCode).to.equal(404);
            done();
          })
          .catch((err) => done(err));
   });

  it('FAIL, Pet is not created if required fields are left blank', (done) => {
      request(app).post('/owners/5f1a3b01d890830fe808913a/pets')
        .send({
             name: '',
             breed: 'Spaniel',
             gender: 'Male',
             age: '5',
             vaccinated: true,
             description: 'A friendly dog..'
        })
        .then((res) => {
          expect(res.statusCode).to.equal(400);
          done();
        })
        .catch((err) => done(err));
   });

  it('FAIL, Pet is not created if invalid age is entered', (done) => {
        request(app).post('/owners/5f1a3b01d890830fe808913a/pets')
          .send({
               name: 'Jack',
               breed: 'Spaniel',
               gender: 'Male',
               age: 'big',
               vaccinated: true,
               description: 'A friendly dog..'
          })
          .then((res) => {
            expect(res.statusCode).to.equal(400);
            done();
          })
          .catch((err) => done(err));
     });



})