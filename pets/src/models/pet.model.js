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
 *          breed:
 *            type: string
 *          gender:
 *            type: string
 *          age:
 *            type: number
 *          vaccinated:
 *            type: boolean
 *          description:
 *            type: string
 *          image:
 *            type: string
 *        example:
 *           name: Toby
 *           breed: Spaniel
 *           gender: Male
 *           age: 5
 *           vaccinated: true
 *           description: Test
 *           image: test.jpg
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
