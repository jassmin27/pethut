/*const app = require('../../app.js');
const request = require('supertest');
let Owner = require('../../models/owner.model');

describe('DELETE /owners', () => {

  it('OK, Deleting owner by ID works', async () => {
      let res = await request(app)
           .post('/owners')
           .send({
                 firstName: 'Test',
                 lastName: 'Cooper',
                 address: 'Texas',
                 phone: '0102030405',
                 email: 'test.cooper@gmail.com'
           })
           expect(200);

        await request(app)
           .delete('/owners/'+res.body.id)
           .expect(200);
  });

})*/