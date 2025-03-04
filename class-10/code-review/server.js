'use strict';

// express connect the server to the client
const express = require('express');

// dotenv connects our server to the .env
require('dotenv').config();

// connects database to server
const pg = require('pg');

// the policeman of the server
const cors = require('cors');

// connects our server to the APIs
const superagent = require('superagent');

// initalizing our express server
const app = express();

// set up the pg client
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// WORST policeman EVER - everyone can connect
app.use(cors());

// declaring our PORT is 3000 from the .env OR 3000
const PORT = process.env.PORT || 3001;

// routes
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents);
app.get('/yelp', getYelp);


// function that gets run when someone visits /location
function getLocation (request, response){
  // this is what the client enters in the search box when they search on the front end
  // this is the city
  let searchQuery = request.query.data;

  let sql = 'SELECT * FROM locations WHERE search_query=$1;';
  let values = [searchQuery];

  client.query(sql, values)
    .then(sqlResults => {
      if(sqlResults.rows[0]){
        console.log('I found the location in the database');
        response.send(sqlResults.rows[0]);
      } else {
        console.log('I am going to google to get the information');
        
        
        
        
        
        // the url is the API url
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
        
        // asking superagent to make an API request to goole maps
        superagent.get(url)
        .then(superagentResults => {
          // if we are successful, we store the correct data in the variables we need
          let results = superagentResults.body.results[0];
          const formatted_address = results.formatted_address;
          const lat = results.geometry.location.lat;
          const long = results.geometry.location.lng;
          
          // create a new location object instance using the superagent results
          const location = new Location(searchQuery, formatted_address, lat, long);

          // location looks like this:
          // location = {
          //   searchQuery:'seattle', 
          //   formatted_address:'Seattle, WA USA',
          //   latitude:'1234,24242',
          //   longitude:'1332341114.22'
          // }
          
          let sql = 'INSERT INTO locations (search_query, formatted_address, latitude, longitude) VALUES ($1, $2, $3, $4);'
          let safeValues = [location.searchQuery, location.formatted_address, location.latitude, location.longitude];

          client.query(sql, safeValues)
            .then(sqlResults => {
              console.log('put the location data in the database');
            })

          // send that data to the front end
          response.send(location);
  })
}
})
  // if we fail, we end up here
  .catch(error => handleError(error, response));
}

// our error handler - sends the error to both the front and back end
function handleError(error, response){
  console.error(error);
  const errorObj = {
    status: 500,
    text: 'somthing went wrong'
  }
  response.status(500).send(errorObj);
}

// function gets called when the /weather route gets hit
function getWeather(request, response){
  // this gets the location object from the request
  let locationDataObj = request.query.data;

  // get the lat and long
  let latitude = locationDataObj.latitude;
  let longitude = locationDataObj.longitude;

  // url for DARK SKYS api
  let URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;

  // superagent make an API requst to DARK SKYS
  superagent.get(URL)
  .then(data => {
    // if successful, store data in the daily array
    let darkSkyDataArray = data.body.daily.data;
    const dailyArray = darkSkyDataArray.map(day => {
      return new Weather(day);
    })
    // send that array to the front end
    response.send(dailyArray);
  })
  .catch(error => console.log(error));

}

function getYelp(request, response){
  const url = `https://api.yelp.com/v3/businesses/search?location=${request.query.data.search_query}`;

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(result => {
      const yelpSummaries = result.body.businesses.map(business => {
        const review = new Yelp(business);
        return review;
      });

      response.send(yelpSummaries);
    })
    .catch(error => handleError(error, response));
}

function getEvents(request, response){
  let locationObj = request.query.data;
  console.log(locationObj);
  const url = `https://www.eventbriteapi.com/v3/events/search?token=${process.env.EVENTBRITE_API_KEY}&location.address=${locationObj.formatted_address}`;

  superagent.get(url)
  .then(eventBriteData => {
    const eventBriteInfo = eventBriteData.body.events.map(eventData => {
      const event = new Event(eventData);
      return event;
    })
    response.send(eventBriteInfo);
  })
  .catch(error => handleError(error, response));
}

// contructor functions
function Event(eventBriteStuff){
  this.link = eventBriteStuff.url;
  this.name = eventBriteStuff.name.text;
  this.event_date = new Date(eventBriteStuff.start.local).toDateString();
  this.summary = eventBriteStuff.summary;
}

function Weather(darkSkyData){
  this.time = new Date(darkSkyData.time*1000).toDateString();
  this.forecast = darkSkyData.summary;
}

function Location(searchQuery, address, lat, long){
  this.searchQuery = searchQuery;
  this.formatted_address = address;
  this.latitude = lat;
  this.longitude = long;
}

function Yelp(business) {
  this.name = business.name;
  this.image_url = business.image_url;
  this.price = business.price;
  this.rating = business.rating;
  this.url = business.url;
}

// helper functions
function errorHandler(error, request, response){
  response.status(500).send(error);
}

// turns on the server
client.connect(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
})
