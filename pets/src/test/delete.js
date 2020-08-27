process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../src/app.js');
const conn = require('../src/index.js');
const axios = require('axios');
const fs = require('fs');

describe('DELETE /owners/:id/pets/:id', () => {

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


  it('OK, Deleting a Pet with valid Owner ID and valid Pet ID works', (done) => {
    let petID = null;
    // Add a new pet first
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
            petID = res.body.pet._id;
            console.log("PET ID : " + petID);
            request(app).delete('/owners/5f1a8750bb8fcb4820068a69/pets/' + petID)
              .then((res) => {
                expect(res.statusCode).to.equal(200);
                done();
              })

      })
      .catch((err) => done(err));
  });

  it('FAIL, Deleting a Pet with INVALID Pet ID does not work', (done) => {
    request(app).delete('/owners/5f1a8750bb8fcb4820068a69/pets/5f1a89e051102a3028b8ab00')
        .then((res) => {
            expect(res.statusCode).to.equal(400);
            done();
        })
        .catch((err) => done(err));
  });




})