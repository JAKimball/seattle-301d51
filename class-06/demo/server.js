'use strict';

// express is the library that lets us set up a server
const express = require('express');
const cors = require('cors');

// this initialized our express server
const app = express();

// tell the browser that it is OK to communicate with the domain that the js isn't running on - tells the browser  that you want the client domain to be able to make server requests.
app.use(cors());

// dotenv is the library that lets us talk to our .env file
require('dotenv').config();


// routes
app.get('/pizza', (request, response) => {
  response.send('I like pizza');
})

app.get('/location', (request, response) => {
  try{
    let searchQuery = request.query.data;
    const geoDataResults = require('./data/geo.json');
  
    const locations = new Location(searchQuery, geoDataResults);
  
    response.status(200).send(locations);
  }
  catch(err){
    console.error(err);
  }
})

// Healper functions
function Location(searchQuery, geoDataResults){
  this.searchQuery = searchQuery;
  this.formatted_query = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;
}


app.use('*', (request, response) => {
  response.status(404).send('huh?');
})

const PORT = process.env.PORT || 3000;

// this starts our express server
app.listen(PORT, () => console.log(`listening on ${PORT}`));