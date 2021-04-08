var port = 8000; 
// var websocket =  8001;
var serverInterval;

var express = require('express');
const jwt = require("jsonwebtoken");
var app = express();
var accessTokenSecret = 'randomstringtestfornow';

var Game = require('./gameStage');

const { Pool } = require('pg');
const pool = new Pool({
    user: 'webdbuser',
    host: 'localhost',
    database: 'webdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

var clients = {};
var gameObj = new Game();
var gameState = gameObj.serialize();
gameState = JSON.stringify(gameState);

var playerAction = {};

serverInterval=setInterval(function(){ 
	var worldJson = JSON.parse(gameState);
	if('bullet' in worldJson){
		var bulletList = worldJson['bullet'];
		var collidedBulletIndex = []
		for(var i = 0; i < bulletList.length; i++){
			bulletList[i].x = bulletList[i].x + bulletList[i].xvelocity;
			bulletList[i].y = bulletList[i].y + bulletList[i].yvelocity;
			// console.log(worldJson['player'][0]);
			var hitPlayer = playerHit(worldJson, worldJson['player'], bulletList[i].x, bulletList[i].y, bulletList[i].damage, bulletList[i].id);
			if(hitPlayer){
				collidedBulletIndex.push(i);
			}
			else{
				var hitObstacle = obstacleHit(worldJson, worldJson['obstacle'], bulletList[i].x, bulletList[i].y, bulletList[i].damage, bulletList[i].id);
				// console.log("Obstacle return", hitObstacle);
				if(hitObstacle){
					collidedBulletIndex.push(i);
				}
			}
		}
		for(var i = 0; i < collidedBulletIndex.length; i++){
			var usedBullet = bulletList[i];
			updatePlayerAction(usedBullet);
			bulletList.splice(i,1);
		}
		worldJson['bullet'] = bulletList;
		gameState = JSON.stringify(worldJson);
	}
},20);


function updatePlayerAction(bulletObj){
	for(const key in playerAction){
		for(var i = 0; i < playerAction[key]; i++){
			if(bulletObj.id == playerAction[key][i].id){
				playerAction[key].splice(i,1);
			}
		}
	}
}

function getBricks(numBricks, id, worldJson){
	var brickPlayer = "";
	for(const key in playerAction){
		for(var i = 0; i < playerAction[key].length; i++){
			if(id == playerAction[key][i].id){
				brickPlayer = key;
				// console.log("WHO DESTROYED: ", brickPlayer);
			}
		}
	}
	var playerList = worldJson['player'];
	for(var i = 0; i < playerList.length; i++){
		if(playerList[i].name == brickPlayer){
			// console.log('Bricks added', numBricks);
			playerList[i].brick += numBricks;
			break;
		}
	}
	worldJson['player'] = playerList;
	gameState = JSON.stringify(worldJson);
}

function playerHit(worldJson, playerList, x, y, damage, id){
	for(var i = 0; i < playerList.length; i ++){
		var player = playerList[i];
		if(((x > player.x - player.radius && x < player.x + player.radius) &&
		(y > player.y - player.radius && y < player.y + player.radius)) || 
		((x + 5 > player.x - player.radius && x + 5 < player.x + player.radius) && 
		(y + 5 > player.y - player.radius && y + 5 < player.y + player.radius))) {
			player.playerHealth -= damage;
			playerList[i] = player;

			// if(player.playerHealth < 0){
			// 	playerList.splice(i, 1);
			// }

			worldJson['player'] = playerList;
			gameState = JSON.stringify(worldJson);
			return true;
		}
	}
	return false;
}


function obstacleHit(worldJson, obsList, x, y, damage, id){
	for(var i = 0; i < obsList.length; i ++){
		var obstacle = obsList[i];
		if(((x > obstacle.x && x < obstacle.x + obstacle.width) && 
				(y > obstacle.y && y < obstacle.y + obstacle.height)) ||
			((x + 5 > obstacle.x && x + 5 < obstacle.x + obstacle.width) && 
				(y + 5 > obstacle.y && y + 5 < obstacle.y + obstacle.height)) ||
			((x + 5 > obstacle.x && x + 5 < obstacle.x + obstacle.width) && 
				(y > obstacle.y && y < obstacle.y + obstacle.height)) ||
			((x > obstacle.x && x < obstacle.x + obstacle.width) && 
				(y + 5 > obstacle.y && y + 5 < obstacle.y + obstacle.height))){
					obstacle.health -= damage;
					obsList[i] = obstacle;
					if(obstacle.health < 0){
						// console.log('obstacle destroyed');
						var numBricksGained = Math.ceil((obstacle.height * obstacle.width)/5000);
						getBricks(numBricksGained, id, worldJson);
						obsList.splice(i, 1);
					}
					worldJson['obstacle'] = obsList;
					gameState = JSON.stringify(worldJson);
					return true;
		}
	}
	return false;
}

function removeActors(actorJson, world){
	var removeObj = actorJson["remove"];
	for(const key in removeObj){
		for(var objIndex = 0 ; objIndex < removeObj[key].length; objIndex++){
			for(var actorIndex = 0; actorIndex < world[key].length; actorIndex++){
				if(removeObj[key][objIndex].id == world[key][actorIndex].id){
					world[key].splice(actorIndex, 1);
				}
			}
		}
	}
	return world
}

var WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({port: 8005});

wss.on('close', function() {
    console.log('disconnected');	
});

wss.broadcast = function(gameState){
	for(let ws of this.clients){ 
		ws.send(gameState); 
	}
}

wss.on('connection', function(ws) {
	console.log("connected");
	ws.send(gameState);

	ws.on('message', function(game) {
		var gamejson = JSON.parse(game);
		var worldJson = JSON.parse(gameState);
		
		if('addPlayer' in gamejson){
			var newPlayer = gamejson['addPlayer'];
			ws.userName = newPlayer.name;
			playerAction[newPlayer.name] = [];
			if('player' in worldJson){
				worldJson['player'].push(newPlayer);
			}
			else{
				worldJson['player'] = [newPlayer];
			}
			gameState = JSON.stringify(worldJson);
		}
		else if('removePlayer' in gamejson){
			console.log('player removed');
			var remove = gamejson['removePlayer'];
			var playerList = worldJson['player'];
			for(var i = 0; i < playerList.length; i++){
				if(playerList[i].name == remove.name){
					playerList.splice(i,1);
					break;
				}
			}
			worldJson['player'] = playerList;
			gameState = JSON.stringify(worldJson);
		}
		else{
			var playerObj = gamejson['player'];

			var worldPlayers = worldJson['player'];
			for(var i = 0; i < worldPlayers.length ; i++){
				if(worldPlayers[i].name == playerObj.name){
					worldPlayers[i] = playerObj;
					break;
				}
			}
			worldJson['player'] = worldPlayers;

			if(!(Object.keys(gamejson['actions']['remove']).length === 0 && gamejson['actions']['remove'].constructor === Object)){
				worldJson = removeActors(gamejson['actions'], worldJson);
			}

			if(gamejson['actions']['shoot']['bullet'].length != 0){
				for(var i = 0; i < gamejson['actions']['shoot']['bullet'].length; i++){
					var currPlayer = gamejson['actions']['shoot']['bullet'][i].player;
					var currGun = currPlayer.gun;
					var x = gamejson['actions']['shoot']['bullet'][i].xcoord;
					var y = gamejson['actions']['shoot']['bullet'][i].ycoord;
					var bulletObj = gameObj.createBullet(x, y, currGun, currPlayer).toJSON();
					playerAction[currPlayer.name].push(bulletObj);
					if("bullet" in worldJson){
						worldJson["bullet"].push(bulletObj);
					}
					else{
						worldJson["bullet"] = [bulletObj];
					}
				}
			}
			
			if(gamejson['actions']['shoot']['brick'].length != 0){
				for(var i = 0; i < gamejson['actions']['shoot']['brick'].length; i++){
					var x = gamejson['actions']['shoot']['brick'][i].xcoord;
					var y = gamejson['actions']['shoot']['brick'][i].ycoord;
					var brickObj = gameObj.createObstacle(x, y).toJSON();
					if("obstacle" in worldJson){
						worldJson["obstacle"].push(brickObj);
					}
					else{
						worldJson["obstacle"] = [brickObj];
					}
				}
			}


			gameState = JSON.stringify(worldJson);
		}

		wss.broadcast(gameState);
	});

	ws.on('close', function(code, reason){
		console.log(ws.userName, ' disconnected');
		var disconnectedUser = ws.userName;
		var worldJson = JSON.parse(gameState);
		var players = worldJson['player'];
		for(var i = 0; i < players.length; i++){
			if(players[i].name == disconnectedUser){
				players.splice(i,1);
			}
		}
		worldJson['player'] = players;
		gameState = JSON.stringify(worldJson);
		wss.broadcast(gameState);
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

