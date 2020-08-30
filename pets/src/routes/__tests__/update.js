const app = require('../../app.js');
const request = require('supertest');
let Pet = require('../../models/pet.model');

describe('PUT /owners/:owner_id/pets/:pet_id', () => {

  it('OK, Updating a Pet works', async done => {
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
           age: '5',
           vaccinated: true,
           description: 'A friendly dog..'
      })
      expect(200);

      const res3 = await request(app).put('/owners/' + res1.body.id + '/pets/' + res2.body.id)
       .send({
             name: 'Jackie',
             breed: 'Spaniel',
             gender: 'Male',
             age: '7',
             vaccinated: true,
             description: 'A friendly dog..'
       })
       expect(200);
       done();
  });

   it('FAIL, Pet is not updated if fields are left blank', async done => {
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
               age: '5',
               vaccinated: true,
               description: 'A friendly dog..'
          })
          expect(200);

          const res3 = await request(app).put('/owners/' + res1.body.id + '/pets/' + res2.body.id)
           .send({
                 name: '',
                 breed: 'Spaniel',
                 gender: 'Male',
                 age: '7',
                 vaccinated: true,
                 description: 'A friendly dog..'
           })
           expect(400);
           done();
   });

   it('FAIL, Pet is not updated if age is non-numeric', async done => {
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
               age: '5',
               vaccinated: true,
               description: 'A friendly dog..'
          })
          expect(200);

          const res3 = await request(app).put('/owners/' + res1.body.id + '/pets/' + res2.body.id)
           .send({
                 name: 'Jack',
                 breed: 'Spaniel',
                 gender: 'Male',
                 age: 'test',
                 vaccinated: true,
                 description: 'A friendly dog..'
           })
           expect(400);
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
    });*/

})