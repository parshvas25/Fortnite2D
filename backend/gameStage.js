var count = 0;
var smgVel = 30;
var arVel = 50;
var enemySize = 15;
var playerHealth = 100;

var xMovement = 0;
var yMovement = 0;
var userScore = 0;

function randint(n, min = 0){ return Math.round(Math.random()*(n - min) + min);}
function rand(n){ return Math.random()*n; }

module.exports = class gameStage {
	constructor(){
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.numObstacles = 20;
        this.numEnemies = 20;
        this.superEnemy = 1;
        this.superEnemyHealth = 80;
        this.enemyHealth = 50;
        this.numSmg = 15;
        this.numAr = 15;
        this.numAmmo = 20;
        this.numHealth = 20;
		this.objectID = 0;

		//SMG
        for(var j = 0; j < this.numSmg; j++) {
            var gunX = randint(2000);
            var gunY = randint(2000);
            var gunPos = new Pair(gunX, gunY);
            var gunDamage = 10;
            var gun = new Gun(this.objectID, this, gunPos, gunDamage, smgVel, 'rgba(128,0,128,1)', 30);
			this.objectID += 1;
            if(!this.checkObstaclePlayerInitialCollision(gun)) {
                this.addActor(gun);
            }
        }
        //Spawm Ammo
        for(var j = 0; j < this.numAmmo; j++) {
            var gunX = randint(2000);
            var gunY = randint(2000);
            var gunPos = new Pair(gunX, gunY);
            var gun = new Ammo(this.objectID, this, gunPos);
			this.objectID += 1;
            if(!this.checkObstaclePlayerInitialCollision(gun)) {
                this.addActor(gun);
            }
        }

        //Spawn Health
        for(var j = 0; j < this.numHealth; j++) {
            var gunX = randint(2000);
            var gunY = randint(2000);
            var gunPos = new Pair(gunX, gunY);
            var health = new Health(this.objectID, this, gunPos);
			this.objectID += 1;
            if(!this.checkObstaclePlayerInitialCollision(health)) {
                this.addActor(health);
            }
        }

        //AR
        for(var j = 0; j < this.numAr; j++) {
            var gunX = randint(2000);
            var gunY = randint(2000);
            var gunPos = new Pair(gunX, gunY);
            var gunDamage = 15;
            var gun = new Gun(this.objectID, this, gunPos, gunDamage, arVel, 'rgba(0,0,255,1)', 15);
			this.objectID += 1;
            if(this.getActor(gunX, gunY) == null) {
                this.addActor(gun);
            }
        }

        //AI Bots
        for(var k = 0; k < this.numEnemies; k++) {
            var enX = randint(2000);
            var enY = randint(2000);
            var enPos = new Pair(enX, enY);
            var colour = 'rgba(255,0,0,1)';
            var enemy = new Enemy(this.objectID, this, enPos, colour, 10, this.enemyHealth);
			this.objectID += 1;
            if(this.getActor(enX, enY) == null) {
                this.addActor(enemy);
            }
        }

        for(var k = 0; k < this.superEnemy; k++) {
            var enX = randint(2000);
            var enY = randint(2000);
            var enPos = new Pair(enX, enY);
            var colour = 'rgba(153,50,204,1)';
            var enemy = new SuperEnemy(this.objectID, this, enPos, colour, 20, this.superEnemyHealth);
			this.objectID += 1;
            if(this.getActor(enX, enY) == null) {
                this.addActor(enemy);
            }
        }

        //Obstacles
        for(var i = 0; i < this.numObstacles; i++){
            var obstacleX = randint(2000);
            var obstacleY = randint(2000);
            var obsPos = new Pair(obstacleX, obstacleY);
            var maxWidth = Math.min(2000 - obstacleX, 350);
            var maxHeight = Math.min(2000 - obstacleY, 350);
            var obstacleWidth = randint(maxWidth, 50);
            var obstacleHeight = randint(maxHeight, 50);
            var obstacleHealth = Math.trunc((obstacleHeight * obstacleWidth)/1000)
            var obj = new Obstacle(this.objectID, obsPos, obstacleHealth, obstacleWidth, obstacleHeight);
			this.objectID += 1;
            if(this.getActor(obstacleX, obstacleY) == null){
                if(!this.checkObstaclePlayerInitialCollision(obj)){
                    this.addActor(obj);
                }
            }
        }
	
	}

	isBullet(obj){
		if(obj instanceof Bullet){
			return true;
		}
		return false;
	}

	getCurrIndex(){
		return this.objectID;
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
			var gunActor = new Gun(this, gunPos, gunImg, gun.damage, gun.bulletVelocity, gun.bulletColor, gun.ammo);
			this.addActor(gunActor);
		}
	}

	populateAmmo(ammoList){
		for(var i = 0 ; i < ammoList.length; i++){
			var ammo = ammoList[i];
			var ammoPos = new Pair(ammo.x, ammo.y);
			var ammoActor = new Ammo(this, ammoPos, ammoImg);
			this.addActor(ammoActor);
		}
	}

	populateHealth(healthList){
		for(var i = 0 ; i < healthList.length; i++){
			var health = healthList[i];
			var healthPos =  new Pair(health.x, health.y);
			var healthActor = new Health(this, healthPos, healthImg);
			this.addActor(healthActor);
		}
	}

	populateEnemy(enemyList){
		for(var i = 0; i < enemyList.length; i++){
			var enemy = enemyList[i];
			var enemyPos = new Pair(enemy.x, enemy.y);
			if(enemy.colour == 'rgba(255,0,0,1)'){
				var enemyActor = new Enemy(this, enemyPos, enemy.colour, 10, this.enemyHealth);
				this.addActor(enemyActor);
			}
			else{
				var superEnemyActor = new SuperEnemy(this, enemyPos, enemy.colour, 20, this.superEnemyHealth);
				this.addActor(superEnemyActor);
			}
		}
	}

	populateObstacle(obsList){
		for(var i = 0; i < obsList.length; i++){
			var obs = obsList[i];
			var obsPos = new Pair(obs.x, obs.y);
			var obsActor = new Obstacle(this, obsPos, brickImg, obs.health, obs.width, obs.height);
			this.addActor(obsActor);
		}
	}

	populatePlayer(playerList){
		for(var i = 0; i< playerList.length; i++){
			var otherPlayer = playerList[i];
			var otherPlayerPos = new Pair(otherPlayer.x, otherPlayer.y);
			var otherPlayerVelocity = new Pair(otherPlayer.xvelocity, otherPlayer.yvelocity);
			var otherPlayerActor = new Player(this, otherPlayerPos, otherPlayerVelocity, otherPlayer.colour, otherPlayer.radius);
			this.addActor(otherPlayerActor);
		}
	}

	populateBullet(bulletList){
		for(var i = 0; i < bulletList; i++){
			var bullet = bulletList[i];
			var bulletPos = new Pair(bullet.x, bullet.y);
			var bulletVelocity = new Pair(bullet.xvelocity, bullet.yvelocity);
			var bulletActor = new Bullet(this, bulletPos, bulletVelocity, bullet.colour, bullet.radius, bullet.damage);
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

	createBullet(x, y, gun, player){
		console.log('Player ammo left: ', player.ammo);
		var velocity = gun.bulletVelocity;
		var damage = gun.damage;
		var color = gun.bulletColor;
		var bulletobj = new Bullet(this.getCurrIndex() + 1, new Pair(player.x, player.y), new Pair(velocity*x, velocity*y), color, 5, damage);
		this.objectID += 1;
		return bulletobj;
	}

	createEnemyBullet(x, y, dx,dy) {
		var velocity = 5;
		var damage = 10;
		var color = 'rgba(255,0,0,1)';
		var bulletObj = new Bullet(this.getCurrIndex() + 1, new Pair(x,y), new Pair(velocity * dx, velocity * dy), color, 5, damage);
		this.objectID += 1;
		return bulletObj;
	}

	createObstacle(x, y, player){
		console.log('Player brick left: ', player.brick);
		var obs = new Obstacle(this.getCurrIndex() + 1, new Pair(x, y), 50, 50, 50);
		this.objectID += 1;
		return obs;
	}

	shootBullet(mouseX, mouseY) {
		if(this.player.haveGun()){
			var rect = this.canvas.getBoundingClientRect();
			var velocity = this.player.gun.bulletVelocity;
			var damage = this.player.gun.damage;
			var color = this.player.gun.bulletColor;
			var unitX = (mouseX - rect.left - this.player.x + xMovement);
			var unitY = mouseY - rect.top - this.player.y + yMovement;
			var uX = unitX / Math.sqrt(Math.pow(unitX, 2) + Math.pow(unitY, 2));
			var uY = unitY / Math.sqrt(Math.pow(unitY, 2) + Math.pow(unitX, 2));
			var b = new Bullet(this, new Pair(this.player.x, this.player.y), new Pair( velocity *uX, velocity *uY), color, 5, damage);
			this.addActor(b);
			this.objectID +=1;
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
				var placedObj = new Obstacle(this, new Pair(xNew, yNew), brickImg, 50, 50, 50);
				this.addActor(placedObj);
				this.player.inventory["brick"] -= 1;
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
		return game;
	}

	step(){
		if(this.player != null){
			console.log(this.numEnemies);
			for(var i=0;i<this.actors.length;i++){
				this.actors[i].step();
			}
		}
		else{
			console.log("game over");
		}
	}

	draw(){
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

class Pair {
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

class GameObject{
    constructor(id, position, health){
        this.position = position;
        this.health = health;
		this.id = id;
        this.intPosition();
    }

    step(){
		this.intPosition();
	}

    intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
}

class Obstacle extends GameObject {
    constructor(id, position, health, width, height){
        super(id, position, health);
        this.width = width;
        this.height = height;
		this.intPosition();
    }

    bulletDamage(bulletObj){
        this.health -= bulletObj.damage;
    }

	toJSON(){
		return {
			id: this.id,
			x:this.position.x,
			y:this.position.y,
			width:this.width,
			height:this.height,
			health:this.health,
		};
	}
}

class Enemy extends GameObject{
	constructor(id, stage, position, colour, damage, health) {
        super(id, position, health);
		this.stage = stage;
        this.colour = colour;
		this.damage = damage;
		this.height = 15;
		this.width = 15;
		this.x = 0;
		this.y = 0;
		this.intPosition();
	}

	step() {
		count+=1;
		if(count % 9 == 0 && count % 100 != 0) {
			var dX = this.stage.player.x - this.x;
			var dY = this.stage.player.y - this.y;
			var uX = dX / Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
			var uY = dY / Math.sqrt(Math.pow(dY, 2) + Math.pow(dX, 2));
			if(this.stage.getActor(this.x + 5 * uX, this.y + 5 * uY) == null) {
				this.x += 5 * uX;
				this.y +=  5 * uY;
			}
			else if(this.stage.getActor(this.x + 5* uX, this.y) == null) {
				this.x += 5 * uX;
			}
			else if(this.stage.getActor(this.x, this.y + 5 * uY) == null) {
				this.y += 5 * uY;
			}
			else {
				var randomX = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
				var randomY = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
				while(this.stage.getActor(this, this.x + 5 * randomX, this.y +  5 *randomY) != null) {
					randomX = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
					randomY = Math.random() * ((Math.floor(Math.random() * 2) * 2) -1);
				}
				this.x += 5 * randomX;
				this.y += 5 * randomY;

			}
			
		}
		else if(count % 100 == 0) {
			this.shootBullet();
		}
	}

	takeDamage(bulletObj) {
		if(bulletObj.colour != 'rgba(255,0,0,1)' && bulletObj.colour != 'rgba(153,50,204,1)') {
		this.health -= bulletObj.damage;
		}
	}

	shootBullet() {
		var velocity = 50;
		var damage = 10;
		var color = 'rgba(255,0,0,1)';
		var unitX = -(this.x - this.stage.player.x);
		var unitY = -(this.y - this.stage.player.y)
		var uX = unitX / Math.sqrt(Math.pow(unitX, 2) + Math.pow(unitY, 2));
		var uY = unitY / Math.sqrt(Math.pow(unitY, 2) + Math.pow(unitX, 2));
		var b = new Bullet(this.stage, new Pair(this.x, this.y), new Pair( velocity *uX, velocity *uY), color, 5, damage);
		this.stage.addActor(b);
	}

	toJSON(){
		return {
			id: this.id,
			x:this.x,
			y:this.y,
			width:this.width,
			height:this.height,
			colour:this.colour,
			damage:this.damage,
			health:this.health,
		};
	}
}

class SuperEnemy extends Enemy {
	constructor(id, stage, position, colour, damage, health) {
		super(id, stage, position, colour, damage, health);
	}

	shootBullet() {
		var velocity = 40;
		var damage = 30;
		var color = 'rgba(153,50,204,1)';
		var unitX = -(this.x - this.stage.player.x);
		var unitY = -(this.y - this.stage.player.y)
		var uX = unitX / Math.sqrt(Math.pow(unitX, 2) + Math.pow(unitY, 2));
		var uY = unitY / Math.sqrt(Math.pow(unitY, 2) + Math.pow(unitX, 2));
		var b = new Bullet(this.stage, new Pair(this.x, this.y), new Pair( velocity *uX, velocity *uY), color, 5, damage);
		this.stage.addActor(b);
	}
}

class Pickup{
    constructor(id, stage, position){
        this.stage = stage;
        this.position = position;
		this.id = id;
    }

    step() {
        this.intPosition();
    }

    intPosition() {
        this.x = Math.round(this.position.x);
        this.y = Math.round(this.position.y);
    }
}

class Ammo extends Pickup{
    constructor(id, stage, position){
        super(id, stage, position);
        this.width = 26;
		this.height = 26;
        this.x = 0;
        this.y = 0;
        this.intPosition();
    }

    toJSON(){
        return {
			id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}

class Health extends Pickup{
    constructor(id, stage, position){
        super(id, stage, position);
        this.width = 26;
		this.height = 26;
        this.x = 0;
        this.y = 0;
        this.intPosition();
    }

    toJSON(){
        return {
			id: this.id,
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height
        };
    }
}

class Gun extends Pickup{
    constructor(id, stage, position, damage, bulletVelocity, bulletColor, ammo) {
        super(id, stage, position);
        this.damage = damage;
		this.width = 52;
		this.height = 52;
		this.bulletVelocity = bulletVelocity;
		this.bulletColor = bulletColor;
		this.ammo = ammo;
        this.x = 0;
        this.y = 0;
        this.intPosition();
    }

	addAmmo () {
		this.ammo += 10;
	}

    toJSON(){
        return {
			id: this.id,
            x:this.x,
            y:this.y,
            damage:this.damage,
            bulletVelocity:this.bulletVelocity,
            bulletColor:this.bulletColor,
            ammo:this.ammo
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
			"brick": 0,
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
			this.position.x = oX;
			this.position.y = oY;
			this.velocity.x = 0;
			this.velocity.y = 0;
		}

		if(currActor instanceof Gun) {
			this.pickUp(currActor);
			this.gun = currActor;
			this.stage.removeActor(currActor);
		}

		if(currActor instanceof Ammo) {
			if(this.stage.player.gun != null) {
			this.stage.player.addAmmo();
			this.stage.removeActor(currActor);
			}
		}

		if(currActor instanceof Health) {
			if(this.stage.player.playerHealth < 100) {
			this.stage.player.addHealth();
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

class Bullet {
	constructor(id, position, velocity, colour, radius, damage){
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