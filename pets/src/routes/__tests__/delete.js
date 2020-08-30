const app = require('../../app.js');
const request = require('supertest');
let Pet = require('../../models/pet.model');
const fs = require('fs');

describe('DELETE /owners/:id/pets/:id', () => {


  it('OK, Deleting a Pet works for valid Pet ID', async done => {
      // Create an Owner
      const res1 = await request(app).post('/owners')
         .send({
               firstName: 'Mary',
               lastName: 'Cooper',
               address: 'Texas',
               phone: '0102030405',
               email: 'mary.cooper@gmail.com'
      })
      expect(200);

      const res2 = await request(app).post('/owners/' + res1.body.id + '/pets')
      .send({
           name: 'Jack',
           breed: 'Spaniel',
           gender: 'Male',
           age: 'test',
           vaccinated: true,
           description: 'A friendly dog..'
      })
      expect(200);

      await request(app).delete('/owners/' + res1.body.id + '/pets/' + res2.body.id)
      expect(200);
      done();
  });

  it('FAIL, Deleting a Pet with INVALID Pet ID returns 404', async done => {
    request(app).delete('/owners/5f1a8750bb8fcb4820068a69/pets/5f1a89e051102a3028b8ab00')
        .then((res) => {
            expect(400);
            done();
        })
        .catch((err) => done(err));
  });





})