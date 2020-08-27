const axios = require('axios');
const { randomBytes } = require('crypto');
const router = require('express').Router();
let Adoption = require('../models/adoption.model');
const { adoptionValidationRules, validate } = require('../middleware/validator.js')

/**
 * @swagger
 * tags:
 *   name: Adoption
 *   description: Adoption management
 */

/**
 * @swagger
 * path:
 *  /adoptions:
 *    get:
 *      summary: Get all adoptions
 *      tags: [Adoptions]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Adoption'
 *        '400':
 *          description: Invalid Request.
 *
 */
// Get ALL
router.route('/').get((req, res) => {
    Adoption.find()
        .then(adoptions => res.json(adoptions))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get Adoption by ID
router.route('/:adoption_id').get((req, res) => {
    Adoption.findById(req.params.adoption_id)
        .then(adoption => res.json(adoption))
        .catch(err => res.status(400).json('Error: ' + err));
});

// ADD New Adoption
router.route('/').post( adoptionValidationRules(), validate, (req, res) => {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    //date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds

    const newAdoption = new Adoption({
        pet: req.body.pet,
        owner: req.body.owner,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        email: req.body.email,
        date: Date.now()
    });
    newAdoption.save()
        .then(() => {

            // Emit Event
            axios.post('http://event-bus-srv:5005/events', {
                type: 'AdoptionCompleted',
                data: newAdoption
            });
            res.status(200).send({
                status: 'Adoption Created Successfully',
                id: newAdoption._id
            });
         })
        .catch(err => res.status(400).json('Error: ' + err));

});


module.exports = router;