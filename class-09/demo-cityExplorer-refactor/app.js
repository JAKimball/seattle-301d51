function locationHandler(request,response) {

  const city = request.query.data;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

  if ( locations[city] ) {
    response.status(200).json(locations[city]);
  }
  else {
    superagent.get(url)
      .then(data => {

        const location = new Location(city, data.body);

        let SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
        let values = [city, location.formatted_query, location.latitude, location.longitude];

        client.query(SQL, values)
          .then( results => {
            const savedLocation = results.rows[0];
            locations[city] = savedLocation;
            response.status(200).json(savedLocation);
          });
      })
      .catch( (error) => {
        errorHandler(error, request, response);
      });
  }
} 