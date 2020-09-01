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
 *      tags: [Owners]
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
        .then(owners => res.status(200).json(owners))
        .catch(err => res.status(400).json({
           status: 'Bad Request'
        });
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
 *          required: true
 *          schema:
 *            type: string
 *            default: '5f1a8750bb8fcb4820068a69'
 *      tags: [Owners]
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
        .then(owner => {
            if(owner)
                res.status(200).json(owner)
            else
                res.status(404).json({
                  status: 'Owner not found.'
               });
        })
        .catch(err => res.status(400).json({
           status: 'Bad Request'
        });
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
 *      tags: [Owners]
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
 *          description: Email already exists
 */
// ADD New Owner
router.route('/').post( ownerValidationRules(), validate, (req, res) => {

    // Check if owner already exist with same email
    let existingOwner;
    Owner.findOne({email: req.body.email})
        .then((existingOwner) => {

            console.log("existingOwner :" + existingOwner);

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

                    if(process.env.NODE_ENV != 'test') {
                        // Emit OwnerAdded Event
                        axios.post('http://event-bus-srv:5005/events', {
                            type: 'OwnerAdded',
                            data: newOwner
                        });
                    }
                    res.status(200).send({
                        status: 'Owner Added Successfully',
                        id: newOwner._id
                    });
                 })
                .catch(err => res.status(400).json({
                   status: 'Bad Request'
                });
        })
        .catch(err => res.status(400).json({
           status: 'Bad Request'
        });

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
 *      tags: [Owners]
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
        .then((ownerUpdated) => {

            if(ownerUpdated) {

                res.status(200).send({
                    status: 'Owner Updated Successfully',
                    owner: ownerUpdated
                });
                if(process.env.NODE_ENV != 'test') {
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'OwnerUpdated',
                        data: ownerUpdated
                    })
                }
            }
            else {
                res.status(404).json({
                  status: 'Owner not found'
               });
            }

        })
        .catch(err => res.status(400).json({
            status: 'Bad Request'
         });

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
 *      tags: [Owners]
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
    Owner.findByIdAndDelete({_id: req.params.id})
        .then((owner) => {

            console.log("In Service:: OWNER to DELETE : " + owner);

            if(owner) {
                res.status(200).send({
                    status: 'Owner Deleted Successfully'
                });

                if(process.env.NODE_ENV != 'test') {
                    // Emit OwnerDeleted Event
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'OwnerDeleted',
                        data: {
                            ownerId: req.params.id
                        }
                    })
                }
            }
            else {
                res.status(404).send({
                   status: 'Owner Not Found'
                });
            }


            //.then(() => console.log("Event Emitted - OwnerDeleted"));
        })
        .catch(err => res.status(400).json({
             status: 'Bad Request'
        });
});

module.exports = router;