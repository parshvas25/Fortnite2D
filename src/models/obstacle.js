import {Bullet, Pair} from './stage';
var enemySize = 15;

export class GameObject{
    constructor(id, stage, position, colour, health){
        this.stage = stage;
		this.id = id;
        this.position = position;
        this.colour = colour;
        this.health = health;
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

export class Obstacle extends GameObject {
    constructor(id, stage, position, colour, health, width, height){
        super(id, stage, position, colour, health);
        this.width = width;
        this.height = height;
		this.intPosition();
    }

    bulletDamage(bulletObj){
        this.health -= bulletObj.damage;
    }

    draw(context){
        var pattern = context.createPattern(this.colour, 'repeat');
        context.fillStyle = pattern;
        context.beginPath(); 
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fill();  
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

export class Enemy extends GameObject{
	constructor(id, stage, position, colour, damage, health) {
        super(id, stage, position, colour, health)
		this.damage = damage;
		this.height = 15;
		this.width = 15;
		this.x = 0;
		this.y = 0;
		this.intPosition();
        this.count = 0;
	}

	step() {
		this.count+=1;
		if(this.count % 9 == 0 && this.count % 100 != 0) {
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
		else if(this.count % 100 == 0) {
			this.shootBullet();
		}
	}

	draw(context) {
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(this.x, this.y, enemySize, 0, 2 * Math.PI, false); 
		context.fillRect(this.x -25, this.y - 25,50,  enemySize * (this.health / 100));
		context.fill();
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

export class SuperEnemy extends Enemy {
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