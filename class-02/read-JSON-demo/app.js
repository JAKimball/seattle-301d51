'use strict';

/* global $ */ // Get eslint to not complain about jQuery

// GOAL: render each dog and their info to the index page

// "name": "Ginger, Destroyer of Pens",
// "image_url": "ginger.jpeg",
// "hobbies": "Eating Cables",
// "stinky" : "somewhat"

const allDogs = [];

function Dog(dog){
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
  allDogs.push(this);
}


$(() => console.log('ready!'));

//AJAX

console.log('Looking for dogs...');

$.get('/data.json', data => {
  console.log('Got data: ', data);
  data.forEach(dog => {
    new Dog(dog);
  });
  renderDogs();
});
// use ajax to get the data file
// then run each dog through the constructor function
// then call a render method on each dog instance
// we will need an array to hold all the dog instances


Dog.prototype.render = function () {
  const myTemplate = $('#dog-template').html();
  const $newSection = $('<section></section>');
  $newSection.html(myTemplate);

  $newSection.find('h2').text(this.name);
  $newSection.find('p').text(this.hobbies);
  $newSection.find('img').attr('src', this.image_url);

  $('main').append($newSection);
};

console.log('Got dogs? ', allDogs.length);

function renderDogs() {
  allDogs.forEach(dog => {
    console.log(dog);
    dog.render();
  });
}
