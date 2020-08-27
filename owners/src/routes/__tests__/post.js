/*const app = require('../../app.js');
const request = require('supertest');
let Owner = require('../../models/owner.model');

describe('POST /owners', () => {

  it('OK, Creating a new owner works', async done => {
    const res = await request(app).post('/owners')
    .send({
          firstName: 'Mary',
          lastName: 'Cooper',
          address: 'Texas',
          phone: '0102030405',
          email: 'mary.cooper@gmail.com'
    })
    expect(res.body.id);
    expect(res.body.status).toEqual('Owner Added Successfully');
    expect(res.statusCode).toEqual(200);
    done();

  });

  it('FAIL, User is not created if fields are left blank', async done => {
      const res = await request(app).post('/owners')
        .send({
            firstName: '',
            lastName: '',
            address: '',
            phone: '',
            email: ''
        })
        expect(res.statusCode).toEqual(400);
        done();
   });

  it('FAIL, User is not created if phone value is non-numeric', async done => {
      const res = await request(app).post('/owners')
      .send({
          firstName: 'Test',
          lastName: 'test',
          address: 'test',
          phone: 'trefd',
          email: 'test@test.com'
      })
      expect(res.statusCode).toEqual(400);
      done();
   });

  it('FAIL, User is not created if email already exists', async () => {
       await request(app)
       .post('/owners')
       .send({
             firstName: 'Mary',
             lastName: 'Cooper',
             address: 'Texas',
             phone: '0102030405',
             email: 'mary1.cooper@gmail.com'
       })
       expect(200);

       await request(app)
       .post('/owners')
       .send({
            firstName: 'Mary New',
            lastName: 'Cooper',
            address: 'Texas',
            phone: '0102030405',
            email: 'mary1.cooper@gmail.com'
       })
       .expect(400);

  });

})*/