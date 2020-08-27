const axios = require('axios');
const router = require('express').Router();
let Pet = require('../models/pet.model');
const { petValidationRules, validate } = require('../middleware/validator.js')
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
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
 *      tags: [Users]
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
router.route('/pets').get((req, res) => {
    Pet.find()
        .then(pets => res.json(pets))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get a pet by id
router.route('/pets/:id').get((req, res) => {
    Pet.findById(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new pet for a given owner
router.route('/owners/:id/pets').post( upload.single('image'), petValidationRules(), validate, (req, res) => {

    // Check if owner is valid or not
    axios.get('http://owners-clusterip-srv:5000/owners/'+req.params.id)
        .then(() => {
            const newPet = new Pet({
                name: req.body.name,
                breed: req.body.breed,
                gender: req.body.gender,
                age: req.body.age,
                vaccinated: req.body.vaccinated,
                description: req.body.description,
                image: req.file.path
            });
            newPet.save()
                .then(() => {
                    // Emit PetAdded Event
                    axios.post('http://event-bus-srv:5005/events', {
                        type: 'PetAdded',
                        data: {
                            newPet,
                            ownerId: req.params.id
                        }
                    });
                    res.json({
                        status: 'Pet added!',
                        pet: newPet
                    });
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).send({
            error: 'Owner does not exist'
        }));
});

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
        .then((newPet) => {
            //console.log(newPet);
            axios.post('http://event-bus-srv:5005/events', { type: 'PetUpdated', data: newPet})
              .then(response => {
                res.status(200).send({
                    status: 'Pet Updated Successfully',
                    pet: newPet
                });
              })
              .catch((error) => {
                console.log("Error :" + error.response.data);
              })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a pet by id
router.route('/owners/:owner_id/pets/:pet_id').delete((req, res) => {
    Pet.findByIdAndDelete({_id: req.params.pet_id})
        .then((deletedPet) => {
            //console.log("deletedPet : " + deletedPet);
            if(!deletedPet) {
                res.status(400).json('Pet not found.');
            }
            else {
                res.status(200).json('Pet found and deleted.');

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
    res.send("Event Received!");
});

module.exports = router;