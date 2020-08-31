const axios = require('axios');
const router = require('express').Router();
let Pet = require('../models/pet.model');
const { petValidationRules, validate } = require('../middleware/validator.js')
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb(null, './uploads/');
        cb(null, './public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //ACCEPT
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    }
    /*else {
        cb(null, false);
        //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }*/
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

/**
 * @swagger
 * tags:
 *   name: Pet
 *   description: Pet management
 */

/**
 * @swagger
 * path:
 *  /pets:
 *    get:
 *      summary: Get all pets
 *      tags: [Pets]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pet'
 *        '400':
 *          description: Invalid Request.
 *
 */
 // Get ALL Pets
router.route('/pets').get((req, res) => {
    Pet.find()
        .then(pets => res.status(200).json(pets))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /pets/{petId}:
 *    get:
 *      summary: Get a pet by ID
 *      parameters:
 *        - in: path
 *          name: petId
 *          required: true
 *          schema:
 *            type: string
 *            default: '5f1a8a1951102a3028b8ab34'
 *      tags: [Pets]
 *      responses:
 *        '200':
 *          description: Successful Operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pet'
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Pet not found
 */
// Get a pet by id
router.route('/pets/:id').get((req, res) => {
    Pet.findById(req.params.id)
        .then(pet => {
            if(pet)
                res.status(200).json(pet)
            else
                res.status(404).json('Pet not found')
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}/pets:
 *    post:
 *      summary: Add a new pet
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/Pet'
 *      tags: [Pets]
 *      responses:
 *        '200':
 *          description: Response body returns a success message and pet object
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                  status: Pet added Successfully
 *                  id: 5f4538d30fb839058e46cb54
 *        '400':
 *          description: Bad Request
 */
// Add a new pet for a given owner
router.route('/owners/:id/pets').post( upload.single('image'), petValidationRules(), validate, (req, res) => {

    // Check if owner is valid or not
    //axios.get('http://owners-clusterip-srv:5000/owners/'+req.params.id)
        //.then(() => {
    const newPet = new Pet({
        name: req.body.name,
        breed: req.body.breed,
        gender: req.body.gender,
        age: req.body.age,
        vaccinated: req.body.vaccinated,
        description: req.body.description,
        image: req.file.filename
    });
    newPet.save()
        .then(() => {
            if(process.env.NODE_ENV != 'test') {
                // Emit PetAdded Event
                axios.post('http://event-bus-srv:5005/events', {
                    type: 'PetAdded',
                    data: {
                        newPet,
                        ownerId: req.params.id
                    }
                });
            }
            res.status(200).json({
                status: 'Pet added successfully',
                pet: newPet
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));

        /*})
        .catch(err => res.status(404).send({
            error: 'Owner does not exist'
        }));*/
});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}/pets/{petId}:
 *    put:
 *      summary: Update a pet by ID
 *      parameters:
 *        - in: path
 *          name: ownerId
 *          type: string
 *          required: true
 *          default: '5f1a8750bb8fcb4820068a69'
 *        - in: path
 *          name: petId
 *          type: string
 *          required: true
 *          default: '5f1a8a1951102a3028b8ab34'
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/Pet'
 *      tags: [Pets]
 *      responses:
 *        '200':
 *          description: Response body returns a success message and updated pet object
 *          content:
 *            application/json:
 *                type: object
 *                example:
 *                  status: Pet Updated Successfully
 *                  pet:
 *                    name: Jack
 *                    breed: G. Shepherd
 *                    gender: Male
 *                    age: 5
 *                    vaccinated: true
 *                    description: Something about the pet...
 *                    image: "pic.jpg"
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Pet not found
 */
// Update a pet by id for a given owner
router.route('/owners/:owner_id/pets/:pet_id').put( upload.single('image'), petValidationRules(), validate, (req, res) => {

    const newPet = new Pet({
        _id: req.params.pet_id,
        name: req.body.name,
        breed: req.body.breed,
        gender: req.body.gender,
        age: req.body.age,
        vaccinated: req.body.vaccinated,
        description: req.body.description
    });

    if(req.file) {
        newPet.image = req.file.path;
    }
    Pet.findOneAndUpdate({_id: req.params.pet_id}, newPet, {new: true})
        .then((petUpdated) => {

            if(petUpdated) {
                if(process.env.NODE_ENV != 'test') {
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'PetUpdated',
                        data: petUpdated
                    })
                }
                res.status(200).send({
                    status: 'Pet Updated Successfully',
                    pet: petUpdated
                })
            }
            else {
                res.status(404).send('Pet not found');
            }

        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @swagger
 * path:
 *  /owners/{ownerId}/pets/{petId}:
 *    delete:
 *      summary: Delete a pet by ID
 *      parameters:
 *        - in: path
 *          name: ownerId
 *          type: string
 *          required: true
 *          default: '5f1a8750bb8fcb4820068a69'
 *        - in: path
 *          name: petId
 *          type: string
 *          required: true
 *          default: '5f1a8a1951102a3028b8ab34'
 *      tags: [Pets]
 *      responses:
 *        '200':
 *          description: Pet Deleted
 *        '400':
 *          description: Invalid ID supplied
 *        '404':
 *          description: Pet not found
 */
// Delete a pet by id
router.route('/owners/:owner_id/pets/:pet_id').delete((req, res) => {
    Pet.findByIdAndDelete({_id: req.params.pet_id})
        .then((deletedPet) => {
            //console.log("deletedPet : " + deletedPet);
            if(!deletedPet) {
                res.status(404).json('Pet not found.');
            }
            else {
                res.status(200).json('Pet deleted.');

                if(process.env.NODE_ENV != 'test') {
                    // Emit PetDeleted Event
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'PetDeleted',
                        data: {
                            ownerId: req.params.owner_id,
                            petId: req.params.pet_id
                        }
                    })
                    .then(() => console.log("Event Emitted - PetDeleted"));
                }
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// BATCH Delete
router.route('/owners/:owner_id/pets').delete((req, res) => {

    let ids = req.query.ids;
    let ids_array = ids.split(",");
    console.log(ids_array);

    Pet.deleteMany({ _id: { $in: ids_array }})
        .then((result) => {
            console.log("Pets deleted! " + result);
            res.status(200).send("Batch Delete Successful");
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Event Listener for Events Received
router.route('/events').post((req, res) => {
    console.log("Event Received in Pet Service: " + req.body.type);

    const { type, data } = req.body;

    if(type === "AdoptionCompleted") {
        // Delete the pet by id
    }

    res.send("Event Received!");
});

module.exports = router;
