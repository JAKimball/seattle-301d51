'use strict';
const happy = require('./happy');

const Person = function(name, age, hair, eyes){
  this.name = name;
  this.age = age;
  this.hair = hair; 
  this.eyes = eyes;
}

happy('I am happy');

Person.prototype.doingLab = function(){
  console.log(`${this.name} is doing lab`);
}
module.exports = Person;