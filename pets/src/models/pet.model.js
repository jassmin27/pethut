/**
 * @swagger
 *  components:
 *    schemas:
 *      Pet:
 *        type: object
 *        required:
 *          - name
 *          - breed
 *          - gender
 *          - age
 *          - vaccinated
 *          - description
 *          - image
 *        properties:
 *          name:
 *            type: string
 *            default: Toby
 *          breed:
 *            type: string
 *            default: Spaniel
 *          gender:
 *            type: string
 *            default: Male
 *          age:
 *            type: number
 *            default: 5
 *          vaccinated:
 *            type: boolean
 *            default: true
 *          description:
 *            type: string
 *            default: Some description..
 *          image:
 *            type: string
 *            format: binary
 *        example:
 *           name: Toby
 *           breed: Spaniel
 *           gender: Male
 *           age: 5
 *           vaccinated: true
 *           description: Test
 *           image: uploads/test.jpg
 */
const mongoose = require('mongoose');

const Gender = Object.freeze({
  Male: 'Male',
  Female: 'Female'
});

const petSchema = new mongoose.Schema({
    name: { type:String, required: true},
    breed: { type:String, required: true},
    gender: { type:String, required: true, enum: Object.values(Gender)},
    age: { type:Number, required: true},
    vaccinated: { type:Boolean, required: false},
    description: { type:String, required: true},
    image: { type: String, required: false}
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
