DROP TABLE IF EXISTS jop;
CREATE TABLE jop (
  id SERIAL PRIMARY KEY,
  name VARCHAR(2000),
  price VARCHAR(2000),
  image_link VARCHAR(2000),
  description VARCHAR(2000)
);