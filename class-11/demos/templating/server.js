'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');

const app = express();

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

// Set the view engine for templating
// Tells express that we are using ejs templating system
// defaults the '/' route to look in the views 
app.set('view engine', 'ejs');

// Array of groceries for /list route
let list = ['apples', 'celery', 'butter', 'milk', 'eggs'];

// Array of quantities for /details route
let quantities = [
  {name: 'apples', quantity: 4},
  {name: 'celery', quantity: 1},
  {name: 'butter', quantity: 1},
  {name: 'milk', quantity: 2},
  {name: 'eggs', quantity: 12}
]

// Routes
// will look in the views folder for index
app.get('/', (request, response) => {
  response.render('index');
})

app.get('/list', (request, response) => {
  response.render('list', {arrayOfItems: list});
})


// start the server
app.listen(PORT, () => console.log(`Listening on ${PORT}`));