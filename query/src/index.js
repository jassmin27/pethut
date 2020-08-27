const mongoose = require('mongoose');
const app = require('./app.js');
require('dotenv').config();

const Mongo_PORT = 5002;
const Mongo_URL = 'mongodb://dbUser:hanji123@cluster0-shard-00-00-myh7e.mongodb.net:27017,cluster0-shard-00-01-myh7e.mongodb.net:27017,cluster0-shard-00-02-myh7e.mongodb.net:27017/pethut?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
//const Mongo_URL_TEST = 'mongodb+srv://dbUser:hanji123@cluster0-myh7e.mongodb.net/pethut_test?retryWrites=true&w=majority';

console.log(`Your mongo port is ${process.env.Mongo_PORT}`);

const mongoose_connection = mongoose.connection;


function connect() {
  return new Promise((resolve, reject) => {

    mongoose.connect(Mongo_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then((res, err) => {
        if (err) return reject(err);
        resolve();
    })

  });
}

function close() {
  return mongoose.disconnect();
}

/*function connection() {
  return mongoose_connection;
}*/

app.listen(Mongo_PORT, () => {
    connect();
    console.log(`Query Server running on port: ${Mongo_PORT}`);
});


module.exports = { connect, close };