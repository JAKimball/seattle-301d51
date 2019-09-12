'use strict'

// GOAL: render the dataSet to the DOM

let neighborhoods = [];

// Example data set:
// name:        'Fremont',
// city:        'Seattle',
// population:  '23,566',
// founded:     '1820',
// body:        '<p>This is example text to show you how <strong>HTML</strong> can be escaped using <em>Handlebars</em>.</p>'

function Neighborhood(rawData){
  this.name = rawData.name;
  this.city = rawData.city;
  this.population = rawData.population;
  this.founded = rawData.founded;
  this.body = rawData.body;

  neighborhoods.push(this);
}

// function Neighborhood(rawData){
//   for(let key in rawData){
//     this[key] = rawData[key];
//   }

//   neighborhoods.push(this);
// }

// create a prototype that makes a template out of the handlebars script html
// complie that template
// return that template
Neighborhood.prototype.toHtml = function(){
  
    // 1. Get the template from the HTML document
    let template = $('#neighborhood-template').html();

    // 2. Use Handlebars to "compile" the HTML
    let templateRender = Handlebars.compile(template);

    // 3. Do not forget to return the HTML from this method
    return templateRender(this);

}


// neighborhoodDataSet comes from the dataSet.js file - global variable
// uses that JSON to make an array of neighborhood objects
neighborhoodDataSet.forEach(neighborhoodObject => {
  new Neighborhood(neighborhoodObject);
})


// loop through global array
// run the .toHtml on each object to creates the handlebars template
// append each template section in the main
neighborhoods.forEach(hood => {
  $('#neighborhoods').append(hood.toHtml());
})