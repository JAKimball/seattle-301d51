'use strict'

// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
// Specify a directory for static resources
app.use(express.static('./public'));

app.use(methodOverride ((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');


// API Routes
app.get('/', getTasks);

app.get('/tasks/:task_id', getOneTask);

app.get('/add', showForm);

app.post('/add', addTask);

app.put('/update/:task_id', updateTask);

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// HELPER FUNCTIONS

function updateTask(request, response){
  console.log('from our form', request.body);
  let id = request.params.task_id;
  let {title, description, category, contact, status} = request.body;
  // collect the information from the form
  console.log('our task id is:', id);

  let sql = 'UPDATE tasks SET title=$1, description=$2, category=$3, contact=$4, status=$5 WHERE id=$6;';
  let values = [title, description, category, contact, status, request.params.task_id];

  client.query(sql, values)
    .then(response.redirect(`/tasks/${request.params.task_id}`))
    .catch(err => handleError(err, response));
  // update the database
  // redirect to the detail page with the new values
}

function getTasks(request, response) {
  let SQL = 'SELECT * from tasks;';

  return client.query(SQL)
    .then(results => response.render('index', { results: results.rows }))
    .catch(err => handleError(err, response));
}

function getOneTask(request, response) {
  let SQL = 'SELECT * FROM tasks WHERE id=$1;';
  let values = [request.params.task_id];

  return client.query(SQL, values)
    .then(result => {
      // console.log('single', result.rows[0]);
      return response.render('pages/detail-view', { task: result.rows[0] });
    })
    .catch(err => handleError(err, response));
}

function showForm(request, response) {
  response.render('pages/add-view');
}

function addTask(request, response) {
  console.log(request.body);
  let { title, description, category, contact, status } = request.body;

  let SQL = 'INSERT INTO tasks(title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, description, category, contact, status];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}


function handleError(error, response) {
  response.render('pages/error-view', { error: 'Uh Oh' });
}