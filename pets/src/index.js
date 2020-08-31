const mongoose = require('mongoose');
const app = require('./app.js');
require('dotenv').config();

const PORT = 5001;
const Mongo_URL = 'mongodb://dbUser:hanji123@cluster0-shard-00-00-myh7e.mongodb.net:27017,cluster0-shard-00-01-myh7e.mongodb.net:27017,cluster0-shard-00-02-myh7e.mongodb.net:27017/pethut?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

const start = async () => {
  try {
    await mongoose.connect(Mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Pet Server running on port: ${PORT}`);
    console.log("__dirname : " + express.static('uploads'));
  });
};

start();