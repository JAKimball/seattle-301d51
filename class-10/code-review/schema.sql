
DROP DATABASE IF EXISTS city_explorer;

CREATE DATABASE city_explorer;

\c city_explorer;

DROP TABLE IF EXISTS locations;

CREATE TABLE IF NOT EXISTS locations ( 
  id SERIAL PRIMARY KEY, 
  search_query VARCHAR(255), 
  formatted_address VARCHAR(255), 
  latitude NUMERIC(10, 7), 
  longitude NUMERIC(10, 7)
);

INSERT INTO locations (search_query) VALUES ('bubble gum');