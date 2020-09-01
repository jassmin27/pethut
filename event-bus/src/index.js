const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.get("/events", (req, res) => {
    res.send("GET working for Event-Bus Service");
});

// Handler/listener for POST events
app.post('/events', (req, res) => {
    const event = req.body;
    console.log('Event Received by Event-Bus : ' + event.type);

    // Post the event to other services
    //Owner
    axios.post('http://owners-clusterip-srv:5000/events', event);
    //Pet
    axios.post('http://pets-srv:5001/events', event);
    //Query
    axios.post('http://query-srv:5002/events', event);
    //Adoption
    axios.post('http://adoptions-srv:5003/events', event);

    res.send({status: 'OK, from Event-Bus'});
});

app.listen(5005, () => {
    console.log('Event-Bus Server running on port 5005');
});
