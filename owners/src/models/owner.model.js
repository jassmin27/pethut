/**
 * @swagger
 *  components:
 *    schemas:
 *      Owner:
 *        type: object
 *        required:
 *          - firstName
 *          - lastName
 *          - address
 *          - phone
 *          - email
 *        properties:
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          address:
 *            type: string
 *          phone:
 *            type: string
 *            format: phone
 *          email:
 *            type: string
 *            format: email
 *            description: Needs to be unique.
 *        example:
 *           firstName: John
 *           lastName: Taylor
 *           address: Athlone
 *           phone: '9874653022'
 *           email: john.taylor@gmail.com
 */
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    firstName: { type:String, required:true},
    lastName: { type:String, required:true},
    address: { type:String, required:true},
    phone: { type:String, required:true},
    email: { type:String, required:true}
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;
