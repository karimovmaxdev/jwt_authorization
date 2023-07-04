CREATE TABLE person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    isActivated BOOLEAN,
    activationLink VARCHAR(255)
);

CREATE TABLE token(
    id SERIAL PRIMARY KEY,
    refreshToken VARCHAR(255),
    person_id INTEGER NOT NULL REFERENCES person(id)
);