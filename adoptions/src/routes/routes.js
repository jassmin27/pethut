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
 *        '400':
 *          description: Invalid Request.
 *
 */
// Get ALL
router.route('/').get((req, res) => {
    Adoption.find()
        .then(adoptions => res.status(200).json(adoptions))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /adoptions/{adoptionId}:
 *    get:
 *      summary: Get an adoption by ID
 *      parameters:
 *        - in: path
 *          name: adoptionId
 *          required: true
 *          schema:
 *            type: string
 *            default: '5f2b1a6de9afce16545bfdab'
 *      tags: [Adoptions]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Adoption'
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Adoption not found
 */
// Get Adoption by ID
router.route('/:adoption_id').get((req, res) => {
    Adoption.findById(req.params.adoption_id)
        .then(adoption => {
            if(adoption) {
                res.status(200).json(adoption);
            }
            else {
                res.status(404).json('Adoption not found');
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /adoptions:
 *    post:
 *      summary: Add a new adoption
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Adoption'
 *      tags: [Adoptions]
 *      responses:
 *        '200':
 *          description: Response body returns a success message and ID of the adoption
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                  status: Adoption Created Successfully
 *                  id: 5f2b1a6de9afce16545bfdab
 *        '400':
 *          description: Bad Request
 */
// ADD New Adoption
router.route('/').post( adoptionValidationRules(), validate, (req, res) => {

    const newAdoption = new Adoption({
        pet: req.body.pet,
        owner: req.body.owner,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        email: req.body.email,
        date: Date.now()
    });
    console.log(newAdoption);

    newAdoption.save()
        .then(() => {

            if(process.env.NODE_ENV != 'test') {
                // Emit Event
                /*axios.post('http://event-bus-srv:5005/events', {
                    type: 'AdoptionCompleted',
                    data: newAdoption
                });*/
                // Delete the Pet
                const deleteUrl = 'http://pets-srv:5001/owners/' + newAdoption.owner._id + '/pets/'+ newAdoption.pet._id;
                console.log("Delete URL : " + deleteUrl);
                axios.delete(deleteUrl)
                    .then(() => console.log("Call for Pet Deletion on adoption"))
                    .catch(err => console.log('Error deleting pet on adoption: ' + err))
            }
            res.status(200).send({
                status: 'Adoption Created Successfully',
                id: newAdoption._id
            });
         })
        .catch(err => res.status(400).json('Error: ' + err));

});


module.exports = router;