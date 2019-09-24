'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', newSearch);

// Creates a new search to the Google Books API
app.post('/searches', searchForBooks);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONS

function newSearch(request, response){
  console.log(request.body);
  response.render('pages/index');
}

function searchForBooks(request, response){
  console.log(request.body.search);
  // response.send(request.body);
  const searchName = request.body.search[0];
  const searchingFor = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(searchingFor === 'title'){
    console.log('in first if')
    url = url+`intitle:${searchName}`;
  }

  if(searchingFor === 'author'){
    console.log('in second if')
    url = url+`inauthor:${searchName}`;
  }

  superagent.get(url)
    .then(superagentResults => {
      console.log(superagentResults.body.items);
      const library = superagentResults.body.items.map(book => {
        return new Book(book);
      })
      response.send(library);
    })
}

function Book(info){
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.volumeInfo.title || 'no title available';
}


