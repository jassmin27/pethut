const app = require('../../app.js');
const request = require('supertest');

describe('GET /adoptions', () => {

  it('OK, Getting adoptions has 0 adoption initially', async done => {
     const res = await request(app).get('/adoptions');
     //console.log(res.body);
     expect(res.statusCode).toEqual(200);
     expect(res.body.length).toEqual(0);
     done();
  });

  it('OK, Getting adoption by ID works', async done => {
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

     const res2 = await request(app).get('/adoptions/'+ res1.body.id)
     expect(200);
     done();
  });

  it('FAIL, Getting adoption returns 404 when ID does not exist', async done => {
       const res1 = await request(app).get('/adoptions/5f2b1a6de9afce16545bfd00')
       expect(404);
       done();
  });

  it('FAIL, Getting adoption returns 400 for invalid ID', async done => {
     const res1 = await request(app).get('/adoptions/123')
     expect(400);
     done();
  });

})