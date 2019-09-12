'use strict';

const Person = function(name, age) {
  this.name = name;
  this.age = age;
};
Person.prototype.getName = function() { return this.name; };

let person = new Person('Fred', 51);

// bad code -- references the same thing over and over
function sayName(person) {
  if (person.age >= 50) {
    return person.getName().toUpperCase();
  } else {
    return person.getName().toLowerCase();
  }
}

// CHALLENGE: GET RID OF THE REPITION


///////////////////////////////////////////////////////////

// This is a function that returns a promise
function doSomethingAsync(person) {
  return Promise.resolve(person);
}

doSomethingAsync(person)
  .then( data => {
    data.name = data.name.toUpperCase();
    console.log('ugly upper', data.name);
    return data;
  })
  .then(differentData => {
    differentData.name = differentData.name.toLowerCase();
    console.log('ugly lower', differentData.name);
  });

// CHALLENGE: refactor this code to be better
