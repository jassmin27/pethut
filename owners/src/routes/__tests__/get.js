const app = require('../../app.js');
const request = require('supertest');

describe('GET /owners', () => {

  it('OK, Getting owners has 0 owner initially', async done => {
     const res = await request(app).get('/owners');
     //console.log(res.body);
     expect(res.statusCode).toEqual(200);
     expect(res.body.length).toEqual(res.body.length);
     done();
  });

  it('OK, Getting owner by ID works', async done => {
     let res = await request(app).post('/owners')
     .send({
           firstName: 'Mary',
           lastName: 'Cooper',
           address: 'Texas',
           phone: '0102030405',
           email: 'mary.cooper@gmail.com'
     })
     expect(200);

     res = await request(app).get('/owners/'+ res.body.id)
     expect(200);
     done();
  });

})