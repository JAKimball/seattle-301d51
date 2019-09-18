'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');


const app = express();
app.use(express.static('public'));

app.use(cors());

const PORT = process.env.PORT || 3000;

// routes
app.get('/location', searchLatToLong);
app.get('/weather', getWeather);



function searchLatToLong (request, response){

  let searchQuery = request.query.data;

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url)
  .then(superagentResults => {
    let results = superagentResults.body.results[0];
    const formatted_address = results.formatted_address;
    const lat = results.geometry.location.lat;
    const long = results.geometry.location.lng;

    const location = new Location(searchQuery, formatted_address, lat, long);
    response.send(location);
  })
  .catch(error => handleError(error, response));


}

function handleError(error, response){
  console.error(error);
  const errorObj = {
    status: 500,
    text: 'somthing went wrong'
  }
  response.status(500).send(errorObj);
}

function getWeather(request, response){

  let locationDataObj = request.query.data;

  let latitude = locationDataObj.latitude;
  let longitude = locationDataObj.longitude;

  console.log(latitude, longitude);
  let URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;

  superagent.get(URL)
  .then(data => {
    let darkSkyDataArray = data.body.daily.data;
    const dailyArray = darkSkyDataArray.map(day => {
      return new Weather(day);
    })

    response.send(dailyArray);
  })
  .catch(error => console.log(error));

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

app.listen(PORT, () => console.log(`listening on ${PORT}`));