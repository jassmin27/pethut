/**
 * @swagger
 *  components:
 *    schemas:
 *      Adoption:
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

const adoptionSchema = new mongoose.Schema({
    pet: {
        name: String,
        breed: String,
        gender: String,
        age: Number,
        vaccinated: Boolean,
        description: String,
        image: String
    },
    owner: {
        firstName: { type:String, required:true},
        lastName: { type:String, required:true},
        address: { type:String, required:true},
        phone: { type:String, required:true},
        email: { type:String, required:true}
    },
    firstName: { type:String, required:true},
    lastName: { type:String, required:true},
    address: { type:String, required:true},
    email: { type:String, required:true},
    date: {type:Date, required: true}

});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;