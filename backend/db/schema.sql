--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
DROP TABLE ftduser;
CREATE TABLE ftduser (
	username VARCHAR(20) PRIMARY KEY,
	password BYTEA NOT NULL,
	firstname VARCHAR(20),
	lastname VARCHAR(20),
	email VARCHAR(100),
	birthday VARCHAR(30)
);

DROP TABLE IF EXISTS score;
CREATE TABLE score (
	username VARCHAR(20) PRIMARY KEY,
	score INT
);
--- Could have also stored as 128 character hex encoded values
--- select char_length(encode(sha512('abc'), 'hex')); --- returns 128
INSERT INTO ftduser VALUES('arnold', sha512('spiderman'), 'dummy', 'user', 'arnold@email.com', '1990-10-25');
INSERT INTO score VALUES('arnold', 0);