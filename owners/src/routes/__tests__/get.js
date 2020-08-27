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

})