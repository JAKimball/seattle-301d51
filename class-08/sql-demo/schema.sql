DROP DATABASE IF EXISTS test;

CREATE DATABASE test;

\c test;

DROP TABLE IF EXISTS people;

CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

INSERT INTO people (first_name, last_name) VALUES ('bob', 'dylan');