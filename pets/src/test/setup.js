let Pet = require('../models/pet.model');
const mongoose = require('mongoose');
const app = require('../app.js');

const Mongo_URL_Test = 'mongodb://dbUser:hanji123@cluster0-shard-00-00-myh7e.mongodb.net:27017,cluster0-shard-00-01-myh7e.mongodb.net:27017,cluster0-shard-00-02-myh7e.mongodb.net:27017/pethut_test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
//const Mongo_URL_Test = '';

beforeAll(async () => {
    await mongoose.connect(Mongo_URL_Test, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
   //console.log("Seed BeforeEach");
   //await seedOwner();
   process.env.NODE_ENV = 'test'
});

afterEach(async () => {
    //console.log("---> DeSeed AfterEach");
    await removeAllCollections();
    //await mongoose.connection.db.dropCollection("owners");
});

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    //console.log("Drop AfterEach");
    await collection.deleteMany()
  }
}

afterAll(async () => {
    //await dropAllCollections();
    // Closes the Mongoose connection
    await mongoose.connection.close();
});

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === 'ns not found') return

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes('a background operation is currently running')) return

      console.log(error.message)
    }
  }
}

async function seedOwner() {
     //const getOwner = await Owner.findOne({ email: 'test.test@gmail.com' });
     //if(!getOwner) {
        const owner = new Owner({
            firstName: 'Test',
            lastName: 'test',
            address: 'Texas',
            phone: '0102030405',
            email: 'test.test@gmail.com'
         });
         await owner.save();
     //}
}