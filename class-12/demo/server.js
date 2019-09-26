'use strict'

// Application Dependencies
const express = require('express');
const pg = require('pg');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended: true}));
// Specify a directory for static resources such as css files
app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => {throw err;});

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
app.get('/', getTasks);

app.get('/tasks/:task_id', getOneTask);

app.get('/add', showForm);

app.post('/add', addTask);

app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
})


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// HELPER FUNCTIONS
function getTasks(request, response){

  const sql = 'SELECT * FROM tasks;';

  client.query(sql)
    .then(sqlResults => {
      response.render('./index.ejs', {results: sqlResults.rows});
    })
}

function getOneTask(request, response){
  console.log('this is my param', request.params.task_id);
  const taskId = request.params.task_id;

  const sql = 'SELECT * FROM tasks WHERE id=$1;';
  const values = [taskId];

  client.query(sql, values)
    .then(sqlResults => {
      console.log('sql results', sqlResults.rows);
      response.render('pages/detail-view', {task: sqlResults.rows[0]})
    })
    .catch(err => handleError(err, response));

}

function showForm(request, response){
  response.render('pages/add-view');
}

function addTask(request, response){

  let {title, description, category, contact, status} = request.body;
  console.log(title);

  let sql = 'INSERT INTO tasks(title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5);';

  let values = [title, description, category, contact, status];

  client.query(sql, values)
    .then(sqlResults => {
      response.redirect('/')
    })
  // when the form is submitted, add a task to the DB, and redirect to home
}


function handleError(error, response) {
  response.render('pages/error-view', {error: 'Uh Oh'});
}