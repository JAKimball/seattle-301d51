'use strict';

let allWeather = [];

function Weather(dataObj){
  this.time = new Date(dataObj.time).toUTCString();
  this.forecast = dataObj.summary;
  allWeather.push(this);
}

Weather.prototype.dailyWeather = function(){
  let template = Handlebars.compile($('#weather-results-template').html());
  return template(this);
}

$(function(){
  $.get('./city-weather-data.json', data => {
    console.log(data);
    data.data.forEach(day => {
      new Weather(day);
    })

    allWeather.forEach(instance => {
      $('#weather-container').append(instance.dailyWeather());
    })
  })
})



// handlebars wants: time and forecast
// time: sat 12th at 10pm
// forecast: partly sunny


