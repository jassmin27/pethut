/*const app = require('../../app.js');
const request = require('supertest');
let Owner = require('../../models/owner.model');

describe('PUT /owners', () => {

  it('OK, Updating an owner works', async () => {
    let res = await request(app)
         .post('/owners')
         .send({
               firstName: 'Shelly',
               lastName: 'Cooper',
               address: 'Texas',
               phone: '0102030405',
               email: 'shelly.cooper@gmail.com'
         })
         expect(200);
         expect(res.body.id);

      await request(app)
         .put('/owners/'+res.body.id)
         .send({
              firstName: 'Missy S.',
              lastName: 'Cooper',
              address: 'Texas',
              phone: '0102030405',
              email: 'missy.cooper@gmail.com'
         })
         .expect(200);
  });

   it('FAIL, Owner is not updated if fields are left blank', async done => {
        // Create an Owner
        let res = await request(app).post('/owners')
        .send({
            firstName: 'John',
            lastName: 'Cooper',
            address: 'Texas',
            phone: '0102030405',
            email: 'john.cooper@gmail.com'
        })
        const ownerId = res.body.id;
        // Update the Owner
        res = await request(app).put('/owners/'+ownerId)
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

   it('FAIL, Owner is not updated if phone value is non-numeric', async done => {
        // Create an Owner
        let res = await request(app).post('/owners')
        .send({
          firstName: 'John',
          lastName: 'Cooper',
          address: 'Texas',
          phone: '0102030405',
          email: 'john.cooper@gmail.com'
        })

        const ownerId = res.body.id;
        // Update the Owner
        res = await request(app).put('/owners/'+ownerId)
        .send({
          firstName: 'John S.',
          lastName: 'Cooper',
          address: 'Texas',
          phone: 'abc',
          email: 'john.cooper@gmail.com'
        })
        expect(res.statusCode).toEqual(400);
        done();
   });

   /*it('OK, Updating an owner does not work, if email is already registered', async done => {
        // Create an Owner
        let res = await request(app).post('/owners')
        .send({
            firstName: 'Mary',
            lastName: 'Cooper',
            address: 'Texas',
            phone: '0102030405',
            email: 'mary.cooper@gmail.com'
        })

        const ownerId = res.body.id;
        // Update the Owner
        res = await request(app).put('/owners/'+ownerId)
        .send({
            firstName: 'Mary S.',
            lastName: 'Cooper',
            address: 'Texas',
            phone: '0102030405',
            email: 'mary.cooper@gmail.com'
        })
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('Owner Updated Successfully');
        done();
    });

})*/