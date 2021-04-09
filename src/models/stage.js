import {Gun, Ammo, Health} from './pickup';
import {Enemy, SuperEnemy, Obstacle} from './obstacle';
import grass_image from '../images/grass.jpg';
import brick_image from '../images/brick.png';
import ar_image from '../images/ar.png';
import smg_image from '../images/smg.png';
import health_image from '../images/health.png';
import ammo_image from '../images/ammo.png';

function randint(n, min = 0){ return Math.round(Math.random()*(n - min) + min);}
function rand(n){ return Math.random()*n; }

var count = 0;
var smgVel = 30;
var arVel = 50;
var enemySize = 15;
var playerHealth = 100;

var brickImg = new Image();
brickImg.src = brick_image;

var grassImg = new Image();
grassImg.src = grass_image;

var arImg = new Image();
arImg.src = ar_image;

var smgImg = new Image();
smgImg.src = smg_image;

var ammoImg = new Image();
ammoImg.src = ammo_image;

var healthImg = new Image();
healthImg.src = health_image;

var xMovement = 0;
var yMovement = 0;
var userScore = 0;

export class Stage {
	constructor(canvas, gamejson, userName, colour){
		this.canvas = canvas;
		this.gameState = "play";
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
		this.deadPlayer = null;
		this.score = 0;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.numObstacles = 40;
		this.numEnemies = 30;
		this.superEnemy = 3;
		this.superEnemyHealth = 80;
		this.enemyHealth = 50;
		this.numSmg = 15;
		this.numAr = 15;
		this.numAmmo = 20;
		this.numHealth = 20;
		this.user = userName;
		this.actions = {"remove": {}, "shoot": {'bullet': [], 'brick': []}};

		this.width=canvas.width;
		this.height=canvas.height; 

		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
        var velocity = new Pair(0,0);
        var radius = 15; 
        var colour= colour;
        this.player = new Player(this, position, velocity, colour, radius, userName);
		this.populateActors(gamejson);
	}	

	checkBullet(){
		for(var i = 0; i < this.actors.length; i++){
			if(this.actors[i] instanceof Bullet){
				return true;
			}
		}
		return false;
	}

	getBullets(){
		var final = [];
		for(var i = 0; i < this.actors.length; i++){
			if(this.actors[i] instanceof Bullet){
				final.push({
					'id': this.actors[i].id,
					'x' : this.actors[i].x,
					'y': this.actors[i].y,
				})
			}
		}
	}

	clearActions(){
		this.actions = {"remove": {}, "shoot": {'bullet': [], 'brick': []}};
	}

	getActions(){
		return this.actions;
	}

	populateActors(gamejson){
		this.actors = [];
		for(const [key, value] of Object.entries(gamejson)){
			if(key == "gun"){
				this.populateGuns(value)
			}
			else if(key == "ammo"){
				this.populateAmmo(value);
			}
			else if(key == "health"){
				this.populateHealth(value);
			}
			else if(key == "enemy"){
				this.populateEnemy(value);
			}
			else if(key == "obstacle"){
				this.populateObstacle(value);
			}
			else if(key == "player"){
				this.populatePlayer(value);
			}
			else if(key == "bullet"){
				this.populateBullet(value);
			}
		}
	}

	populateGuns(gunList){
		for(var i = 0 ; i < gunList.length; i++){
			var gun = gunList[i];
			if(gun.bulletVelocity == 30){
				var gunImg = smgImg;
			}
			else if(gun.bulletVelocity == 50){
				var gunImg = arImg;
			}
			var gunPos = new Pair(gun.x, gun.y);
			var gunActor = new Gun(gun.id, this, gunPos, gunImg, gun.damage, gun.bulletVelocity, gun.bulletColor, gun.ammo);
			this.addActor(gunActor);
		}
	}

	populateAmmo(ammoList){
		for(var i = 0 ; i < ammoList.length; i++){
			var ammo = ammoList[i];
			var ammoPos = new Pair(ammo.x, ammo.y);
			var ammoActor = new Ammo(ammo.id, this, ammoPos, ammoImg);
			this.addActor(ammoActor);
		}
	}

	populateHealth(healthList){
		for(var i = 0 ; i < healthList.length; i++){
			var health = healthList[i];
			var healthPos =  new Pair(health.x, health.y);
			var healthActor = new Health(health.id, this, healthPos, healthImg);
			this.addActor(healthActor);
		}
	}

	populateEnemy(enemyList){
		for(var i = 0; i < enemyList.length; i++){
			var enemy = enemyList[i];
			var enemyPos = new Pair(enemy.x, enemy.y);
			if(enemy.colour == 'rgba(255,0,0,1)'){
				var enemyActor = new Enemy(enemy.id, this, enemyPos, enemy.colour, 10, this.enemyHealth);
				this.addActor(enemyActor);
			}
			else{
				var superEnemyActor = new SuperEnemy(enemy.id, this, enemyPos, enemy.colour, 20, this.superEnemyHealth);
				this.addActor(superEnemyActor);
			}
		}
	}

	populateObstacle(obsList){
		for(var i = 0; i < obsList.length; i++){
			var obs = obsList[i];
			var obsPos = new Pair(obs.x, obs.y);
			var obsActor = new Obstacle(obs.id, this, obsPos, brickImg, obs.health, obs.width, obs.height);
			this.addActor(obsActor);
		}
	}

	populatePlayer(playerList){
		var playerAlive = true;
		for(var i = 0; i< playerList.length; i++){
			if(playerList[i].name != this.user){
				var otherPlayer = playerList[i];
				var otherPlayerPos = new Pair(otherPlayer.x, otherPlayer.y);
				var otherPlayerVelocity = new Pair(otherPlayer.xvelocity, otherPlayer.yvelocity);
				var otherPlayerActor = new Player(this, otherPlayerPos, otherPlayerVelocity, otherPlayer.colour, otherPlayer.radius, otherPlayer.name);
				this.addActor(otherPlayerActor);
			}
			else{
				// console.log('player found');
				// console.log("New player health: ", playerList[i].playerHealth);
				this.player.playerHealth = playerList[i].playerHealth;
				if(this.player.playerHealth < 0){
					playerAlive = false;
					this.deadPlayer = this.player;
					this.removePlayer();
					break;
				}
				if(this.player.inventory['brick'] < playerList[i].brick){
					console.log("Updated to", playerList[i].brick)
					this.player.inventory['brick'] = playerList[i].brick;
				}
				this.player.getBrick(playerList[i].brick);
				this.addActor(this.player);
			}
		}	
	}

	populateBullet(bulletList){
		for(var i = 0; i < bulletList.length; i++){
			var bullet = bulletList[i];
			var bulletPos = new Pair(bullet.x, bullet.y);
			var bulletVelocity = new Pair(bullet.xvelocity, bullet.yvelocity);
			var bulletActor = new Bullet(bullet.id, this, bulletPos, bulletVelocity, bullet.colour, bullet.radius, bullet.damage);
			this.addActor(bulletActor);
		}
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	getPlayer(){
		return this.player;
	}

	removeEnemy(){
		this.numEnemies -= 1;
		console.log(this.numEnemies);
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	shootBullet(mouseX, mouseY) {
		if(this.player.haveGun()){
			var rect = this.canvas.getBoundingClientRect();

			var unitX = (mouseX - rect.left - this.player.x + xMovement);
			var unitY = mouseY - rect.top - this.player.y + yMovement;
			var uX = unitX / Math.sqrt(Math.pow(unitX, 2) + Math.pow(unitY, 2));
			var uY = unitY / Math.sqrt(Math.pow(unitY, 2) + Math.pow(unitX, 2));
			
			if("bullet" in this.actions["shoot"]){
				this.actions["shoot"]["bullet"].push({
					"player" : this.player,
					"xcoord" : uX,
					"ycoord" : uY,
				});
			}
			else{
				this.actions["shoot"]["bullet"] = [{
					"player" : this.player,
					"xcoord" : uX,
					"ycoord" : uY,
				}];
			}

			this.player.useAmmo();
			if(this.player.ammo == 0){
				this.player.removeGun();
			}
		}
	}

	checkObstaclePlayerInitialCollision(obstacle){
		var playerX = Math.floor(this.width/2);
		var playerY = Math.floor(this.height/2);
		if(playerX > obstacle.position.x && playerX < obstacle.position.x + obstacle.width &&
			playerY > obstacle.position.y && playerY < obstacle.position.y + obstacle.height){
				return true;
			}
		return false;
	}

	placeBlock(x, y){
		var rect = this.canvas.getBoundingClientRect();
		if(this.player.inventory["brick"] > 0){
			var xNew = x - rect.left + xMovement;
			var yNew = y - rect.top + yMovement;
			if(this.getActor(xNew, yNew) == null){
				console.log("block placed");
				// var placedObj = new Obstacle(this, new Pair(xNew, yNew), brickImg, 50, 50, 50);
				// this.addActor(placedObj);

				if("brick" in this.actions["shoot"]){
					this.actions["shoot"]["brick"].push({
						"player" : this.player,
						"xcoord" : xNew,
						"ycoord" : yNew,
					});
				}
				else{
					this.actions["shoot"]["brick"] = [{
						"player" : this.player,
						"xcoord" : xNew,
						"ycoord" : yNew,
					}];
				}

				// this.player.inventory["brick"] -= 1;
				this.player.useBrick();
				console.log('Bricks left: ', this.player.inventory['brick']);
			}
		}
	}

	placeBlockPhone(x, y) {
		var rect = this.canvas.getBoundingClientRect();
		if(this.player.inventory["brick"] > 0){
			var xNew = x - rect.left;
			var yNew = y - rect.top;
			if(this.getActor(xNew, yNew) == null){
				console.log("block placed");
				// var placedObj = new Obstacle(this, new Pair(xNew, yNew), brickImg, 50, 50, 50);
				// this.addActor(placedObj);

				if("brick" in this.actions["shoot"]){
					this.actions["shoot"]["brick"].push({
						"player" : this.player,
						"xcoord" : xNew,
						"ycoord" : yNew,
					});
				}
				else{
					this.actions["shoot"]["brick"] = [{
						"player" : this.player,
						"xcoord" : xNew,
						"ycoord" : yNew,
					}];
				}

				// this.player.inventory["brick"] -= 1;
				this.player.useBrick();
				console.log('Bricks left: ', this.player.inventory['brick']);
			}
		}
	}

	serialize(){
		var game = {};
		for(var i = 0; i < this.actors.length; i++){
			var actorJSON = this.actors[i].toJSON();
			if(this.actors[i] instanceof Obstacle){
				if("obstacle" in game){
					game["obstacle"].push(actorJSON);
				}
				else{
					game["obstacle"] = [actorJSON];
				}
			}

			else if(this.actors[i] instanceof Gun){
				if("gun" in game){
					game["gun"].push(actorJSON);
				}
				else{
					game["gun"] = [actorJSON];
				}
			}

			else if(this.actors[i] instanceof Enemy){
				if("enemy" in game){
					game["enemy"].push(actorJSON);
				}
				else{
					game["enemy"] = [actorJSON];
				}
			}

			else if(this.actors[i] instanceof Player){
				if("player" in game){
					game["player"].push(actorJSON);
				}
				else{
					game["player"] = [actorJSON];
				}
			}

			else if(this.actors[i] instanceof Ammo){
				if("ammo" in game){
					game["ammo"].push(actorJSON);
				}
				else{
					game["ammo"] = [actorJSON];
				}
			}

			else if(this.actors[i] instanceof Health){
				if("health" in game){
					game["health"].push(actorJSON);
				}
				else{
					game["health"] = [actorJSON];
				}
			}
			
			else if(this.actors[i] instanceof Bullet){
				if("bullet" in game){
					game["bullet"].push(actorJSON);
				}
				else{
					game["bullet"] = [actorJSON];
				}
			}
		}

		game["remove"] = {}
		for (const [key, value] of Object.entries(this.actions["remove"])) {
			for(var i = 0; i < value.length ; i++){
				if(key in game["remove"]){
					game["remove"][key].push(value[i].toJSON());
				}
				else{
					game["remove"][key] = [value[i].toJSON()];
				}
			}
		}

		game["shoot"] = {}

		for(var i = 0; i < this.actions["shoot"]["bullet"].length; i++){
			if("bullet" in game["shoot"]){
				game["shoot"]["bullet"].push({
					'player': this.actions["shoot"]["bullet"][i].player.toJSON(),
					'xcoord': this.actions["shoot"]["bullet"][i].xcoord,
					'ycoord': this.actions["shoot"]["bullet"][i].ycoord,
				});
			}
			else {
				game["shoot"]["bullet"] = [{
					'player': this.actions["shoot"]["bullet"][i].player.toJSON(),
					'xcoord': this.actions["shoot"]["bullet"][i].xcoord,
					'ycoord': this.actions["shoot"]["bullet"][i].ycoord,
				}];
			}
		}

		for(var i = 0; i < this.actions["shoot"]["brick"].length; i++){
			console.log("serializing brick");
			if("brick" in game["shoot"]){
				game["shoot"]["brick"].push({
					'player': this.actions["shoot"]["brick"][i].player.toJSON(),
					'xcoord': this.actions["shoot"]["brick"][i].xcoord,
					'ycoord': this.actions["shoot"]["brick"][i].ycoord,
				});
			}
			else {
				game["shoot"]["brick"] = [{
					'player': this.actions["shoot"]["brick"][i].player.toJSON(),
					'xcoord': this.actions["shoot"]["brick"][i].xcoord,
					'ycoord': this.actions["shoot"]["brick"][i].ycoord,
				}];
			}
			
		}
		
		if(!(Object.keys(game["shoot"]).length === 0 && game["shoot"].constructor === Object)){
			console.log(game)
		}
		return game;
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		if(this.gameState == "play"){
			if(this.player != null){
				for(var i=0;i<this.actors.length;i++){
					this.actors[i].step();
				}
			}
			else{
				console.log("game over");
			}
		}
	}

	draw(){
		// console.log("Actors: ")
		// for(var i = 0; i < this.actors.length ; i++){
		// 	console.log(this.actors[i]);
		// }
		if(this.player != null){
			var context = this.canvas.getContext("2d");
			context.setTransform(1,0,0,1,0,0);
			var x = this.clamp(this.player.x - (context.canvas.width/2), 0, 2000 - context.canvas.width);
			var y = this.clamp(this.player.y - (context.canvas.height /2), 0, 2000 -context.canvas.height);
			xMovement = x;
			yMovement = y;
			context.translate(-x, -y);
			context.clearRect(0, 0, this.width, this.height);
			this.drawBoard(context, 50, 100, 100);
			for(var i=0;i<this.actors.length;i++){
				this.actors[i].draw(context);
			}
		}
		else{
			console.log("draw over");
		}
		
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i] instanceof Obstacle){
				if(this.checkCollision(this.actors[i], x, y)){
					return this.actors[i];
				}
			}

			if(this.actors[i] instanceof Gun) {
				if(this.checkCollision(this.actors[i], x, y)) {
					return this.actors[i];
				}
			}
			if(this.actors[i] instanceof Enemy) {
				if(this.checkCollision(this.actors[i], x, y)) {
					return this.actors[i];
				}
			}
			
			if(this.actors[i] instanceof Player) {
				if(this.checkCollision(this.actors[i], x, y)) {
					return this.actors[i];
				}
				
			}

			if(this.actors[i] instanceof Ammo) {
				if(this.checkCollision(this.actors[i], x, y)) {
					return this.actors[i];
				}	
			}

			if(this.actors[i] instanceof Health) {
				if(this.checkCollision(this.actors[i], x, y)) {
					return this.actors[i];
				}
			}

			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}

	isWon(){
		return this.numEnemies == 0;
	}

	clamp(value, a, b) {
		if(value < a) {
			return a;
		}
		else if (value > b) {
			return b;
		}
		return value;
	}

	getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX  + xMovement,
			y: evt.clientY - rect.top + yMovement
		};
	}

	checkCollision(obstacle, x, y){
		if(((x > obstacle.x && x < obstacle.x + obstacle.width) && 
				(y > obstacle.y && y < obstacle.y + obstacle.height)) ||
			((x + 15 > obstacle.x && x + 15 < obstacle.x + obstacle.width) && 
				(y + 15 > obstacle.y && y + 15 < obstacle.y + obstacle.height)) ||
			((x + 15 > obstacle.x && x + 15 < obstacle.x + obstacle.width) && 
				(y > obstacle.y && y < obstacle.y + obstacle.height)) ||
			((x > obstacle.x && x < obstacle.x + obstacle.width) && 
				(y + 15 > obstacle.y && y + 15 < obstacle.y + obstacle.height))){
					return true;
		}
		return false;
	}

	drawBoard(context, size, rows, cols){
		for(var i = 0; i < rows; i++){
			for(var j=0; j < cols; j++){
				var pattern = context.createPattern(grassImg, 'repeat');
				context.fillStyle = pattern;
				context.fillRect(i*size, j*size, size, size);
			}
		}
	}
} 

export class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

export class Bullet {
	constructor(id, stage, position, velocity, colour, radius, damage){
		this.stage = stage;
		this.id = id;
		this.position=position;
		this.x = this.position.x;
		this.y = this.position.y;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.damage = damage;
		this.velocity=velocity;
		this.xvelocity = this.velocity.x;
		this.yvelocity = this.velocity.y;
		this.colour = colour;
		this.radius = radius;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		var currActor = this.stage.getActor(this.position.x, this.position.y);
		if(currActor instanceof Obstacle){
			
			this.stage.removeActor(this);
			currActor.bulletDamage(this);
			if(currActor.health <= 0){
				if(this.colour != 'rgba(255,0,0,1)' && this.colour != 'rgba(153,50,204,1)'){
					var obstacleBlocks = Math.ceil((currActor.height * currActor.width)/5000);
					this.stage.player.getBrick(obstacleBlocks);
				}
				this.stage.removeActor(currActor);
			}
		}

		if(currActor instanceof Enemy) {
			this.stage.player.score += 10;
			this.stage.removeActor(this);
			currActor.takeDamage(this);
			if(currActor.health <= 0) {
				this.stage.player.score += 10;
				this.stage.removeEnemy();
				this.stage.removeActor(currActor);
			}
		}

		if(currActor instanceof Player) {
			if(this.colour == 'rgba(255,0,0,1)') {
			this.stage.removeActor(this);
			currActor.takeDamage(this.damage);
			if(currActor.playerHealth <= 0) {
				this.stage.score = this.stage.player.score;
				this.stage.removePlayer();

				}
			}
			else if(this.colour == 'rgba(153,50,204,1)') {
				this.stage.removeActor(this);
				currActor.takeDamage(this.damage);
				if(currActor.playerHealth <= 0) {
					this.stage.removePlayer();
				}
			}
		}


		this.intPosition();
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

	draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}

	toJSON(){
		return {
			id: this.id,
			x:this.x,
			y:this.y,
			xvelocity:this.xvelocity,
			yvelocity:this.yvelocity,
			damage:this.damage,
			colour:this.colour,
			radius:this.radius
		};
	}

}

class Player{
	constructor(stage, position, velocity, colour, radius, name) {
		this.stage = stage;
		this.user = name;
		this.position=position;
		this.intPosition(); 
		this.x = this.position.x;
		this.y = this.position.y;
		this.velocity=velocity;
		this.xvelocity = this.velocity.x;
		this.yvelocity = this.velocity.y
		this.colour = colour;
		this.radius = radius;
		this.gun = null;
		this.ammo = 0;
		this.score = 0;
		this.inventory = {
			"gun": "",
			"brick": 5,
		};

		this.playerHealth = playerHealth;
		this.height = 15;
		this.width = 15;
	}

	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		var oX = this.position.x;
		var oY = this.position.y;
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		var currActor = this.stage.getActor(this.position.x, this.position.y);
		if(currActor instanceof Obstacle){
			console.log("Obstacle found");
			this.position.x = oX;
			this.position.y = oY;
			this.velocity.x = 0;
			this.velocity.y = 0;
		}

		if(currActor instanceof Gun) {
			console.log("Gun found");
			this.pickUp(currActor);
			this.gun = currActor;
			if("gun" in this.stage.actions["remove"]){
				this.stage.actions["remove"]["gun"].push(currActor);
			}
			else{
				this.stage.actions["remove"]["gun"] = [currActor];
			}
			this.stage.removeActor(currActor);
		}

		if(currActor instanceof Ammo) {
			if(this.stage.player.gun != null) {
				console.log("Ammo found");
				this.stage.player.addAmmo();
				if("ammo" in this.stage.actions["remove"]){
					this.stage.actions["remove"]["ammo"].push(currActor);
				}
				else{
					this.stage.actions["remove"]["ammo"] = [currActor];
				}

				this.stage.removeActor(currActor);
			}
			else{
				console.log("No gun");
			}
		}

		if(currActor instanceof Health) {
			if(this.stage.player.playerHealth < 100) {
				this.stage.player.addHealth();
				console.log("Health found");
				if("health" in this.stage.actions["remove"]){
					this.stage.actions["remove"]["health"].push(currActor);
				}
				else{
					this.stage.actions["remove"]["health"] = [currActor];
				}
				this.stage.removeActor(currActor);
			}
		}

		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>2000){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>2000){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
		this.intPosition();
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

	draw(context){
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.fillRect(this.x -25, this.y - 25,50,   15 * (this.playerHealth / 2000));
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();  
	}

	takeDamage(damage) {
		this.playerHealth -= damage;
	}

	pickUp(obj){
		this.inventory["gun"] = obj;
		this.ammo = obj.ammo;
	}

	clamp(value, a, b) {
		if(value < a) {
			return a;
		}
		else if (value > b) {
			return b;
		}
		return value;
	}

	haveGun(){
		return this.inventory["gun"] != "";
	}

	removeGun(){
		this.inventory["gun"] = "";
		this.gun = null;
	}
	addAmmo() {
		this.ammo += 10;
	}
	
	addHealth() {
		this.playerHealth +=10;
	}

	useAmmo(){
		this.ammo -= 1;
	}

	useBrick(){
		this.inventory['brick'] -= 1;
	}

	getInventory(){
		return this.inventory;
	}

	haveBrick(){
		return this.inventory["brick"] > 0;
	}

	getBrick(num){
		this.inventory["brick"] += num;
	}

	toJSON(){
		return {
			name: this.user,
			x:this.x,
			y:this.y,
			xvelocity:this.xvelocity,
			yvelocity:this.yvelocity,
			colour:this.colour,
			radius:this.radius,
			ammo:this.ammo,
			score:this.score,
			gun:this.inventory["gun"],
			brick:this.inventory["brick"],
			playerHealth:this.playerHealth,
			height:this.height,
			width:this.width,
		};
	}

}