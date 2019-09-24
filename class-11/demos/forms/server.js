'use strict';
// Require express to make our serve work easier
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.static('public'));

app.listen(PORT, () => {console.log(`listening on ${PORT}`)});

// Load middleware to help parse the request.body
app.use(express.urlencoded({extended:true}));

// Load middleware to tell the server where to find our web files

// Add a route to listen for a post (form request)

app.post('/contact', (request, response) => {
  console.log(request.body);
  response.sendFile('./thanks.html', {root:'./public'});
})

// Add a catch-all to listen for routes that don't exist

app.use('*', (request, response) => {
  response.status(404).send('this route does not exist');
})

// Tell the server to start listening

