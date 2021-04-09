var port = 8000; 
// var websocket =  8001;
var serverInterval;
const cors = require('cors');
var express = require('express');
const jwt = require("jsonwebtoken");
var app = express();
var accessTokenSecret = 'randomstringtestfornow';
app.use(cors());
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

var count = 0;
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
			var hitEnemy = enemyHit(worldJson, worldJson['enemy'], bulletList[i].x, bulletList[i].y, bulletList[i].damage, bulletList[i].id);
			if(hitEnemy){
				collidedBulletIndex.push(i);
			}
			else{
				var hitPlayer = playerHit(worldJson, worldJson['player'], bulletList[i].x, bulletList[i].y, bulletList[i].damage, bulletList[i].id);
				if(hitPlayer){
					collidedBulletIndex.push(i);
				}
				else{
					var hitObstacle = obstacleHit(worldJson, worldJson['obstacle'], bulletList[i].x, bulletList[i].y, bulletList[i].damage, bulletList[i].id);
					if(hitObstacle){
						collidedBulletIndex.push(i);
					}
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

function enemyHit(worldJson, enemyList, x, y, damage, id){
	for(var i = 0; i < enemyList.length; i ++){
		var enemy = enemyList[i];
		if(((x > enemy.x - enemy.width && x < enemy.x + enemy.width) &&
		(y > enemy.y - enemy.width && y < enemy.y + enemy.width)) || 
		((x + 5 > enemy.x - enemy.width && x + 5 < enemy.x + enemy.width) && 
		(y + 5 > enemy.y - enemy.width && y + 5 < enemy.y + enemy.width))) {
			enemy.health -= damage;
			enemyList[i] = enemy;

			if(enemy.health < 0){
				enemyList.splice(i, 1);
			}

			worldJson['enemy'] = enemyList;
			gameState = JSON.stringify(worldJson);
			return true;
		}
	}
	return false;
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

function enemyMovementCollision(worldJson, x, y) {
	var obsList = worldJson['obstacle'];
	for (var i = 0; i < obsList.length; i++) {
		obstacle = obsList[i];
		if((x + 15 >= obstacle.x && obstacle.x + obstacle.width >= x) && (y + 15 >= obstacle.y && obstacle.y + obstacle.health >= x)) {
			return true;
		}
	}
	return false;
}


function enemyShoot(playerObj, worldJson) {
	var enemyList = worldJson['enemy'];
	var randomPlayer = playerObj[Math.floor(Math.random() * playerObj.length)];
	for(var j = 0; j < enemyList.length; j++) {
		var x = enemyList[j].x;
		var y = enemyList[j].y;
		var dX = randomPlayer.x - enemyList[j].x;
		var dY = randomPlayer.y - enemyList[j].y;
		var uX = dX / Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
		var uY = dY / Math.sqrt(Math.pow(dY, 2) + Math.pow(dX, 2));
		var bulletObj = gameObj.createEnemyBullet(x, y ,uX, uY);
		if("bullet" in worldJson) {
			worldJson["bullet"].push(bulletObj)
		} else {
			worldJson["bullet"] = [bulletObj];
		}
	}
}


function moveEnemies(playerObj, worldJson) {
	var enemyList = worldJson['enemy'];
	var randomPlayer = playerObj[Math.floor(Math.random() * playerObj.length)];
	for(var j = 0; j< enemyList.length; j++) {
		var dX = randomPlayer.x - enemyList[j].x;
		var dY = randomPlayer.y - enemyList[j].y;
		var uX = dX / Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
		var uY = dY / Math.sqrt(Math.pow(dY, 2) + Math.pow(dX, 2));
		if(enemyMovementCollision(worldJson, enemyList[j].x + uX, enemyList[j] + uY) != true) {
			enemyList[j].x += uX;
			enemyList[j].y +=   uY;
		} else {
			var randomX = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
			var randomY = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
			while(enemyMovementCollision(worldJson, enemyList[j].x + randomX, enemyList[j] + randomY ) != true) {
				randomX = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
				randomY = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
			}
			enemyList[j].x += 3 *randomX;
			enemyList[j].y +=   3 * randomY;

		}
	}
	return enemyList;
}

function updatePlayerBrick(playerName, playerList, game){
	for(var i =0; i< playerList.length; i++){
		if(playerList[i].name == playerName){
			playerList[i].brick -= 1;
			break;
		}
	}
	game['player'] = playerList;
	gameState = JSON.stringify(game);
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
		count +=1;
		var gamejson = JSON.parse(game);
		var worldJson = JSON.parse(gameState);
		if('addPlayer' in gamejson){
			var newPlayer = gamejson['addPlayer'];
			// console.log("newplayer: ", newPlayer);
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
			gameState = JSON.stringify(worldJson);

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
					var currPlayer = gamejson['actions']['shoot']['brick'][i].player;
					updatePlayerBrick(currPlayer.name, worldJson['player'], worldJson);
					var brickObj = gameObj.createObstacle(x, y, currPlayer).toJSON();
					if("obstacle" in worldJson){
						worldJson["obstacle"].push(brickObj);
					}
					else{
						worldJson["obstacle"] = [brickObj];
					}
				}
			}

			var newEnemyList = moveEnemies(worldPlayers, worldJson);
			worldJson['enemy'] = newEnemyList;
			if(count % 500 == 0) {
			enemyShoot(worldPlayers, worldJson);
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
	console.log(req);
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
		} else {
			console.log("score updated");
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
				console.log("user was found");
				var email = pgRes.rows[0].email;
				var firstname = pgRes.rows[0].firstname;
				var lastname = pgRes.rows[0].lastname;
				var birthday = pgRes.rows[0].birthday;
				let sql2 = 'SELECT score FROM score WHERE username=$1';
				pool.query(sql2, [username], (err, result) => {
					console.log("this also works");
					var highscore = result.rows[0].score;
					const accessToken = jwt.sign({user: username, pass: password}, accessTokenSecret);
					res.status(200);
					res.json({accessToken, highscore, username, email, firstname, lastname, birthday});
				})
			} else {
                		res.status(403).json({ error: 'Not authorized'});
        		}
		});
	} catch(err) {
               	res.status(403).json({ error: 'Not authorized'});
	}
});

app.use('/api/delete', function(req, res) {

	var uname = req.body.username;
	
	let sql = 'DELETE FROM ftduser WHERE username=$1';
	pool.query(sql, [uname], (err, pgRes) => {
		console.log(pgRes);
		if(!err) {
			let sql1 = 'DELETE FROM score where username=$1';
			pool.query(sql1, [uname], (err, pgRes) => {
				console.log(pgRes);
				if(!err) {
					res.status(200);
					res.json({"message": "user deleted"});
				}
			})
		}
	})

});

app.use('/api/leaderboard', function(req, res) {
	let sql = 'SELECT username, score FROM score ORDER BY score desc';
	pool.query(sql, (err, pgRes) => {
			res.status(200);
			console.log("before");
			res.json(pgRes.rows);
			console.log("after");
	})
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

