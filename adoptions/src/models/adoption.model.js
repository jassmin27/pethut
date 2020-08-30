/**
 * @swagger
 *  components:
 *    schemas:
 *      Adoption:
 *        type: array
 *        pet:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            breed:
 *              type: string
 *            gender:
 *              type: string
 *            age:
 *              type: number
 *            vaccinated:
 *              type: boolean
 *            description:
 *              type: string
 *            image:
 *              type: string
 *              format: binary
 *        owner:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            address:
 *              type: string
 *            phone:
 *              type: string
 *              format: phone
 *            email:
 *              type: string
 *              format: email
 *        example:
 *          pet:
 *            name: Milo
 *            breed: Rottweiler
 *            gender: Male
 *            age: 5
 *            vaccinated: false
 *            description: Some description..
 *            image: 'uploads/pic.jpg'
 *          owner:
 *            firstName: Connie
 *            lastName: Tucker
 *            address: Athlone
 *            phone: '9874653022'
 *            email: connie.tucker@gmail.com
 *          firstName: Bella
 *          lastName: G
 *          address: Athlone
 *          email: bellag@gmail.com
 *          date: ...
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