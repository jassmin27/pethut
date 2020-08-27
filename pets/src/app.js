const express = require('express');
const cors = require('cors');
const petRouter = require('./routes/routes.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Pet API",
            description: "Pet API Information",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://pethut.com/pets"
            }
        ]
    },
    apis: ["src/app.js","src/routes/routes.js", "src/models/pet.model.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(express.json());
app.use(petRouter);
app.use('/pets-api', swaggerUI.serve, swaggerUI.setup(swaggerDocs, {explorer : true}));

// Event Listener for Events Received
app.post('/events', (req, res) => {
    console.log("Event Received by Pet Service: " + req.body.type);
    res.send({});
});

module.exports = app;