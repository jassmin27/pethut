const axios = require('axios');
const router = require('express').Router();
let Query = require('../models/query.model');


// Find Query By Owner Id
router.route('/query/owners/:id').get((req, res) => {
    Query.findOne({ownerId : req.params.id})
        .then((result) => {
            if(!result)
                res.status(404).json('Query by Owner ID not found');
            else
                res.status(200).json(result);
        })
        .catch(err => res.status(404).json('Error: ' + err));
});

// Find Query By Pet Id
router.route('/query/pets/:id').get((req, res) => {
    Query.findOne({"pets._id" : req.params.id})
        .then((result) => {
            if(!result)
                res.status(404).json('Query by Pet ID not found');
            else
                res.status(200).json(result);
        })
        .catch(err => res.status(404).json('Error: ' + err));
});

// Receive Events
router.route('/events').post((req, res) => {

    console.log("Event Received by Query Service: " + req.body.type);
    const { type, data } = req.body;

    if(type === "OwnerAdded") {

        const { _id, firstName, lastName, address, phone, email } = data;
        const newQuery = new Query({
            ownerId: _id,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
            email: email,
            pets: []
        });
        console.log(JSON.stringify(newQuery, null, 2));
        newQuery.save()
            .then(() => res.json("Query added!"))
            .catch(err => res.status(400).json('Error : ' + err));
    }
    else if(type === "OwnerUpdated") {
          const { _id, firstName, lastName, address, phone, email } = data;

          console.log("Updated Query Response");

          Query.findOneAndUpdate({ownerId:_id}, {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
            email: email
          }, {new: true})
              .then((response) => {
                 if(response) {
                     console.log("Query found");
                     res.json("Query found");
                 }
                 else {
                    console.log("Query NOT found");
                    res.json("Query NOT found");
                 }
               })
              .catch(err => res.status(400).json('Error : ' + err));

    }
    else if(type === "OwnerDeleted") {
        const { ownerId } = data;
        console.log("Owner Id to delete : " + ownerId);

        // Get list of associated pets
        Query.findOne({ownerId: ownerId})
            .then((query) => {
                console.log("Query found by OwnerID for deletion");
                console.log(query);
                console.log('Pets Length : ' + query.pets.length);
                if(query.pets.length > 0) {
                    console.log("Inside >0");
                    // Call BATCH DELETE REST endpoint on Pet Service
                    let pet_ids = [];
                    query.pets.forEach((pet)=> {
                        console.log("pet : " + pet);
                        console.log("pet id : " + pet._id);
                        pet_ids.push(pet._id);
                    });

                    console.log("IDs array : " + pet_ids);
                    console.log("Concatenated IDs : " + pet_ids.join());
                    let deleteUrl = 'http://pets-srv:5001/owners/' + ownerId + '/pets?ids=' + pet_ids.join();
                    console.log("deleteUrl : " + deleteUrl);

                    axios.delete(deleteUrl)
                        .then(() => {
                            console.log("Batch Delete Successful in Query Service");
                            // Delete document from queries db
                            Query.deleteOne({_id:query._id})
                                .then(() => console.log("Query for Owner Deleted!"))
                        })

                }
                else {
                    // Delete document from queries db
                    Query.deleteOne({_id:query._id})
                        .then(() => console.log("Query for Owner Deleted!"))
                }
            })
            .catch(err => res.status(400).json('Error : ' + err));


    }
    else if(type === "PetAdded") {

        const { newPet, ownerId } = data;
        console.log("NEW PET : " + newPet);
        console.log("Owner ID for NEW PET : " + ownerId);

        // Update entry by owner id
        Query.findOneAndUpdate({ownerId : ownerId},
        { $addToSet: { pets: [newPet] } })
            .then( (data) => {
                if(data === null) {
                    throw new Error('Owner Not Found');
                }
                res.json({ message: 'Pet added to Owner!' });
            })
            .catch(err => res.status(400).json('Error: ' + err));
    }
    else if(type === "PetUpdated") {

    }
    else if(type === "PetDeleted") {
        // OwnerId and PetId are received
        const { ownerId, petId } = data;
        // Find document by ownerId and delete pet by id

        //{ $addToSet: { pets: [newPet] } }
        console.log("OwnerId Received : " + ownerId);
        console.log("PetId Received : " + petId);
        Query.findOneAndUpdate({ownerId:ownerId}, {$pull:{ pets:{ _id: petId}}}, {new: true})
              .then((response) => {
                 console.log("Response Pet Delete in Query");
                 console.log(response);
                 if(response) {
                     console.log("Pet found and Deleted from Queries DB");
                     res.json("Pet found and Deleted from Queries DB :" + response);
                 }
                 else {
                    console.log("Pet NOT found in Queries DB");
                    res.json("Pet NOT found in Queries DB");
                 }
               })
              .catch(err => res.status(400).json('Error : ' + err));
    }
    else if(type === "PetDeleted") {

    }
});

module.exports = router;
