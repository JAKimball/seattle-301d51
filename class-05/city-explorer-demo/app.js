'use strict';

const weatherInstances = [];

function Weather(day){
  this.time = new Date(day.time).toUTCString();
  this.forecast = day.summary;

  weatherInstances.push(this);
}

Weather.prototype.render = function(){
  let template = Handlebars.compile($('#weather-results-template').html());
  return template(this);
}

$.get('/city-weather-data.json')
.then(ajaxResults => {
  console.log('the ajax Resluts are:', ajaxResults);

  ajaxResults.data.forEach(day => {
    new Weather(day);
  })
  
  renderWeather(weatherInstances);
})

function renderWeather(array){
  array.forEach(day => {
    $('#weather-container').append(day.render());
  })
}
