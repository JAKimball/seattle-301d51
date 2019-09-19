'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');

const app = express();

const PORT = process.env.PORT || 3001;

// connect to the database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// routes
app.get('/', (request, response) => {
  response.status(200).send('I am alive');
})

app.get('/add', (request, response) => {
  let firstName = request.query.first;
  let lastName = request.query.last;

  // save info in database
  let sql = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2);';
  let value = [firstName, lastName];
  client.query(sql, value)
  .then(pgResults => {
    console.log('our pgResults', pgResults.rows);
    response.status(200).json(pgResults);
  })
  .catch(error => errorHandler(error));
})

app.use('*', (request, response) => {
  response.status(404).send('These are not the droids you are looking for');
})

app.use(errorHandler);

function errorHandler(error, request, response){
  response.status(500).send(error);
}

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  })
  .catch(error => errorHandler(error));