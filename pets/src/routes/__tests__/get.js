const app = require('../../app.js');
const request = require('supertest');
const fs = require('fs');

describe('GET /pets', () => {

  it('OK, Getting ALL pets has 0 pets initially', async done => {
    const res = await request(app).get('/pets')
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
    done();
  });

  it('OK, Getting a pet by a valid ID works', async done => {

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

       // Get Pet by ID
       const res3 = await request(app).get('/pets/' + res2.body.pet._id)
       //console.log(res3.statusCode);
       expect(400);

       done();
  });

  it('FAIL, Getting a pet a returns 404', async done => {
          request(app).get('/pets/123')
          .then((res) => {
              expect(res.statusCode).toEqual(400);
              done();
          })
          .catch((err) => done(err));
  });

  it('FAIL, Getting a pet returns 404, if ID does not exist', async done => {
        request(app).get('/pets/5f1a8a5a51102a3028b8ab00')
        .then((res) => {
            expect(res.statusCode).toEqual(404);
            done();
        })
        .catch((err) => done(err));
  });


})