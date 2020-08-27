const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    ownerId: { type:String, required:true},
    firstName: { type:String, required:true},
    lastName: { type:String, required:true},
    address: { type:String, required:true},
    phone: { type:String, required:true},
    email: { type:String, required:true},
    pets: [{
        name: String,
        breed: String,
        gender: String,
        age: Number,
        vaccinated: Boolean,
        description: String,
        image: String
    }]
});

const Query = mongoose.model('Query', querySchema);

module.exports = Query;