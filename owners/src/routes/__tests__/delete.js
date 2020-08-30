const app = require('../../app.js');
const request = require('supertest');
let Owner = require('../../models/owner.model');

describe('DELETE /owners', () => {

  it('OK, Deleting owner by valid ID works', async () => {
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
       console.log("ID of new Owner added to delete: " + res.body.id);

       res = await request(app)
       .delete('/owners/'+res.body.id)
       .expect(res.status);
  });

  it('FAIL, Deleting owner by Invalid ID returns 404', async () => {
      await request(app)
      .delete('/owners/5f1a8750bb8fcb4820068a00')
      .expect(404);
  });

})