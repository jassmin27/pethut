const axios = require('axios');
const router = require('express').Router();
let Owner = require('../models/owner.model');
const { ownerValidationRules, validate } = require('../middleware/validator.js')

/**
 * @swagger
 * tags:
 *   name: Owner
 *   description: Owner management
 */

/**
 * @swagger
 * path:
 *  /owners:
 *    get:
 *      summary: Get all owners
 *      tags: [Users]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Owner'
 *        '400':
 *          description: Invalid Request.
 *
 */
 // Get ALL Owners
router.route('/').get((req, res) => {
    Owner.find()
        .then(owners => res.json(owners))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}:
 *    get:
 *      summary: Get an owner by ID
 *      parameters:
 *        - in: path
 *          name: ownerId
 *          type: string
 *          required: true
 *      tags: [Users]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Owner'
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Owner not found
 */
// GET Owner By ID
router.route('/:id').get((req, res) => {
    Owner.findById(req.params.id)
        .then(owner => res.json(owner))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /owners:
 *    post:
 *      summary: Add a new owner
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Owner'
 *      tags: [Users]
 *      responses:
 *        '200':
 *          description: Response body returns a success message and ID of the owner
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                  status: Owner Added Successfully
 *                  id: 5f4538d30fb839058e46cb54
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Owner not found
 */
// ADD New Owner
router.route('/').post( ownerValidationRules(), validate, (req, res) => {

    // Check if owner already exist with same email
    let existingOwner;
    Owner.findOne({email: req.body.email})
        .then((existingOwner) => {

            //console.log("existingOwner :" + existingOwner);

            if(existingOwner != null) {
                return res.status(400).json({ errors: [{'msg':'Email already exists'}] });
            }

            const newOwner = new Owner({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email
            });
            newOwner.save()
                .then(() => {

                    // Emit OwnerAdded Event
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'OwnerAdded',
                        data: newOwner
                    });
                    res.status(200).send({
                        status: 'Owner Added Successfully',
                        id: newOwner._id
                    });
                 })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}:
 *    put:
 *      summary: Update an owner by ID
 *      parameters:
 *        - in: path
 *          name: ownerId
 *          type: string
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Owner'
 *      tags: [Users]
 *      responses:
 *        '200':
 *          description: Response body returns a success message and updated owner object
 *          content:
 *            application/json:
 *                type: object
 *                example:
 *                  status: Owner Updated Successfully
 *                  owner:
 *                    firstName: John
 *                    lastName: Taylor
 *                    address: Athlone
 *                    phone: '9874653022'
 *                    email: john.taylor@gmail.com
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Owner not found
 */
// UPDATE Owner By ID
router.route('/:id').put( ownerValidationRules(), validate, (req, res) => {

    const newOwner = new Owner({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email
    });

    Owner.findOneAndUpdate({_id: req.params.id}, newOwner, {new: true})
        .then((newOwner) => {

            //console.log(newOwner);

            axios.post('http://event-bus-srv:5005/events', {
                type: 'OwnerUpdated',
                data: newOwner
            })
            //.then(response => {
                res.status(200).send({
                    status: 'Owner Updated Successfully',
                    owner: newOwner
                });
            /*})
            .catch((error) => {
                console.log("Error :" + error.response.data);
            })*/
        })
        .catch(err => res.status(400).json('Error emitting event: ' + err));

});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}:
 *    delete:
 *      summary: Delete an owner by ID
 *      parameters:
 *        - in: path
 *          name: ownerId
 *          type: string
 *          required: true
 *      tags: [Users]
 *      responses:
 *        '200':
 *          description: Owner Deleted
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Owner not found
 */
// DELETE Owner By ID
router.route('/:id').delete((req, res) => {
    Owner.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).send({
                status: 'Owner Deleted Successfully'
            });

            // Emit OwnerDeleted Event
            axios.post('http://event-bus-srv:5005/events', {
                type: 'OwnerDeleted',
                data: {
                    ownerId: req.params.id
                }
            })
            .then(() => console.log("Event Emitted - OwnerDeleted"));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;