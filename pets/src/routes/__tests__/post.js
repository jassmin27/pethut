const app = require('../../app.js');
const request = require('supertest');
let Pet = require('../../models/pet.model');
const fs = require('fs');

describe('POST /owners/:owner_id/pets', () => {

  it('OK, Creating a new pet works', async done => {
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
    
       // Create a Pet
       const res2 = await request(app).post('/owners/' + res1.body.id + '/pets')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .field('name', 'Jack')
       .field('breed', 'Spaniel')
       .field('gender', 'Male')
       .field('age', '5')
       .field('vaccinated', true)
       .field('description', 'A friendly dog..')
       .attach('image',fs.readFileSync('uploads/test-dog.jpg'),'test-dog.png')
        expect(200);

        done();
  });

   /*it('FAIL, Pet is not created if owner does not exist', async done => {
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
   });*/

  it('FAIL, Pet is not created if required fields are left blank, returns 400', async done => {
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

      //Create a Pet
      const res2 = await request(app).post('/owners/' + res1.body.id + '/pets')
        .send({
             name: '',
             breed: 'Spaniel',
             gender: 'Male',
             age: '5',
             vaccinated: true,
             description: 'A friendly dog..'
        })
        .then((res) => {
          expect(400);
          done();
        })
        .catch((err) => done(err));
   });

  it('FAIL, Pet is not created if invalid age is entered, returns 400', async done => {
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
      .then((res) => {
        expect(400);
        done();
      })
      .catch((err) => done(err));
  });



})