var port = 8000; 

var websocket = port + 1;

var express = require('express');
const jwt = require("jsonwebtoken");
var app = express();
var accessTokenSecret = 'randomstringtestfornow';

const { Pool } = require('pg');
const pool = new Pool({
    user: 'webdbuser',
    host: 'localhost',
    database: 'webdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

function isObject(o){ return typeof o === 'object' && o !== null; }
function isNaturalNumber(value) { return /^\d+$/.test(value); }

var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: websocket});

var gameState="";

wss.on('close', function() {
    console.log('disconnected');	
});

wss.broadcast = function(gameState){
	for(let ws of this.clients){ 
		ws.send(gameState); 
	}
}

wss.on('connection', function(ws) {
	ws.send(gameState)

	ws.on('message', function(game) {
		wss.broadcast(game);
		gameState = game;
	});
});


// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw()); // support raw bodies

// Non authenticated route. Can visit this without credentials
app.post('/api/test', function (req, res) {
	res.status(200); 
	res.json({"message":"got here"}); 
});

app.post('/api/register', function (req, res){
	console.log("route called");
	console.log(req.body);
	var uname = req.body.username;
	var pswd = req.body.password;
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var email = req.body.email;
	var birthday = req.body.birthday;
	let sql = 'INSERT INTO ftduser(username, password, firstname, lastname, email, birthday) VALUES($1, sha512($2), $3, $4, $5, $6);';
	pool.query(sql, [uname, pswd, fname, lname, email, birthday], (err, pgRes) =>{
		if(err && err.code ==23505){
			res.status(409);
			res.json({"error": 'User already exists'});
			return;
		}
		if (err) {
			res.status(500);
			res.json({"error":err.message});
			return;
  		} 
		if(pgRes.rowCount == 1){
			let sql2 = 'INSERT INTO score(username, score) VALUES($1, $2)';
			pool.query(sql2, [uname, 0], (err, result) => {
				if(!err) {
					res.status(200);
					res.json({"Success": "User registered"});
					return;
				}
			})
			
		} 
		else {
			res.status(500);
			res.json({"error":"couldn't add to database"});
			return;
		}
	});

});

/** 
 * This is middleware to restrict access to subroutes of /api/auth/ 
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
**/
function generateToken() {
	var token = Math.random().toString(36).substr(2);
	return token;
}

function authenticateToken(req, res, next) {
	if(!req.headers.authorization) {
			return res.status(403).json({ error: 'No token sent!' })
	}
	const auth = req.headers.authorization;
	const token = auth && auth.split(' ')[1];
	if(token == null) {
			res.status(403).json({error: 'No token provided'});
	}
	else {
			jwt.verify(token, accessTokenSecret, (err, user) => {
					if(err) {
							return res.sendStatus(403);
					}
					next();
			});
	}
}

app.post('/api/update', function(req, res) {
	var username = req.body.username;
	var score = req.body.score;
	let sql = "UPDATE score SET score=$2 WHERE username=$1";
	pool.query(sql, [username, score] , (err, pgres) => {
		if(err) {
			res.status(403).json({error: 'Could not update db'});
		}
	});
});

app.post('/api/profile', function(req, res) {
	console.log(req);
	console.log("update recieved");
	var uname = req.body.username;
	var pswd = req.body.password;
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var email = req.body.email;
	var birthday = req.body.birthday;
	console.log("good from here");
	let sql = "UPDATE ftduser SET password=sha512($2), firstname=$3,lastname=$4, email=$5, birthday=$6 WHERE username=$1";
	pool.query(sql, [uname,pswd,fname,lname,email,birthday], (err, result) => {
		if(!err) {
			res.status(200).json({"message" :"Update successful"});
		}
	})


});

app.use('/api/login', function (req, res) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: 'No credentials sent!' });
  	}
	try {
		// var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var m = /^Basic\s+(.*)$/.exec(req.headers.authorization);

		var user_pass = Buffer.from(m[1], 'base64').toString()
		m = /^(.*):(.*)$/.exec(user_pass); // probably should do better than this

		var username = m[1];
		var password = m[2];

		console.log(username+" "+password);

		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
        	pool.query(sql, [username, password], (err, pgRes) => {
  			if (err){
                		res.status(403).json({ error: 'Not authorized'});
			} else if(pgRes.rowCount == 1){
				var email = pgRes.rows[0].email;
				let sql2 = 'SELECT score FROM score WHERE username=$1';
				pool.query(sql2, [username], (err, result) => {
					var highscore = result.rows[0].score;
					const accessToken = jwt.sign({user: username, pass: password}, accessTokenSecret);
					res.status(200);
					res.json({accessToken, highscore, username, email});
				})
			} else {
                		res.status(403).json({ error: 'Not authorized'});
        		}
		});
	} catch(err) {
               	res.status(403).json({ error: 'Not authorized'});
	}
});






// All routes below /api/auth require credentials 
// app.post('/api/auth/login', function (req, res) {
// 	res.status(200); 
// 	res.json({"message":"authentication success"}); 
// });

app.post('/api/auth/test',authenticateToken, function (req, res) {
	res.status(200); 
	res.json({"message":"got to /api/auth/test"}); 
});

app.use('/',express.static('static_content')); 

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});