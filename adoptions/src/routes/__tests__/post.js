const app = require('../../app.js');
const request = require('supertest');

describe('POST /adoptions', () => {

  it('OK, Creating a new owner works', async done => {
    // Create an adoption
     const res1 = await request(app).post('/adoptions')
     .send({
           pet: {
               name: "Toby",
               breed: "Spaniel",
               gender: "Male",
               age: 5,
               vaccinated: true,
               description: "Test",
               image: "uploads/test.jpg"
           },
           owner: {
               firstName: 'Mary',
               lastName: 'Cooper',
               address: 'Texas',
               phone: '0102030405',
               email: 'mary.cooper@gmail.com'
           },
           firstName: 'Sheila',
           lastName: 'G',
           address: 'Athlone',
           email: 'sheila.g@gmail.com',
           date: Date.now()
     })
     expect(200);
     done();

  });

  it('FAIL, Adoption is not created if fields are left blank', async done => {
      const res = await request(app).post('/adoptions')
        .send({
               pet: {
                   name: "Toby",
                   breed: "Spaniel",
                   gender: "Male",
                   age: 5,
                   vaccinated: true,
                   description: "Test",
                   image: "uploads/test.jpg"
               },
               owner: {
                   firstName: 'Mary',
                   lastName: 'Cooper',
                   address: 'Texas',
                   phone: '0102030405',
                   email: 'mary.cooper@gmail.com'
               },
               firstName: '',
               lastName: '',
               address: 'Athlone',
               email: 'sheila.g@gmail.com',
               date: Date.now()
         })
        expect(res.statusCode).toEqual(400);
        done();
   });

  it('FAIL, Adoption is not created if email is invalid', async done => {
      const res = await request(app).post('/adoptions')
      .send({
             pet: {
                 name: "Toby",
                 breed: "Spaniel",
                 gender: "Male",
                 age: 5,
                 vaccinated: true,
                 description: "Test",
                 image: "uploads/test.jpg"
             },
             owner: {
                 firstName: 'Mary',
                 lastName: 'Cooper',
                 address: 'Texas',
                 phone: '0102030405',
                 email: 'mary.cooper@gmail.com'
             },
             firstName: 'Sheila',
             lastName: 'G',
             address: 'Athlone',
             email: 'abc',
             date: Date.now()
       })
      expect(res.statusCode).toEqual(400);
      done();
   });

})