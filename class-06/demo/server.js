'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
});

app.get('/bananas', (request, response) => {
  response.send('I am bananas for bananas');
})

app.get('/location', (request, response) => {
  const tempData = 
    {
      "search_query": "seattle",
      "formatted_query": "Seattle, WA, USA",
      "latitude": "47.606210",
      "longitude": "-122.332071"
    }

    const locationName = request.query.data;
    console.log(locationName);


    response.send(tempData);
})