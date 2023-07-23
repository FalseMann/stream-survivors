import {Container, Texture, TilingSprite} from 'pixi.js';
import {KeyManager} from './util/key-manager.js';
import {Enemy} from './entities/enemy.js';

export type WorldOptions = {
	height: number;
	width: number;
};

export class World extends Container {
	enemies: Enemy[] = [];
	entities: Container;
	enemySpawnRate: number;
	ground: TilingSprite;
	playerX: number;
	playerY: number;
	playerSpeed: number;
	keyManager: KeyManager;

	constructor(options: WorldOptions) {
		super();
		const groundTexture = Texture.from('Environment/Grass.png');
		this.entities = new Container();
		this.enemySpawnRate = 0.01;
		this.ground = new TilingSprite(groundTexture, options.width, options.height);
		this.keyManager = new KeyManager();
		this.playerX = options.width / 2;
		this.playerY = options.height / 2;
		this.playerSpeed = 10;
		this.addChild(this.ground);
		this.addChild(this.entities);
	}

	tick(_delta: number) {
		this.movePlayer();

		if (Math.random() < this.enemySpawnRate) {
			this.spawnEnemy();
		}

		this.aggregateEnemies();
	}

	moveBy(x: number, y: number) {
		this.ground.tilePosition.x -= x;
		this.ground.tilePosition.y -= y;

		this.entities.x -= x;
		this.entities.y -= y;

		this.playerX += x;
		this.playerY += y;
	}

	movePlayer() {
		let moveX = 0;
		let moveY = 0;

		if (this.keyManager.up()) {
			moveY -= this.playerSpeed;
		}

		if (this.keyManager.right()) {
			moveX += this.playerSpeed;
		}

		if (this.keyManager.down()) {
			moveY += this.playerSpeed;
		}

		if (this.keyManager.left()) {
			moveX -= this.playerSpeed;
		}

		this.moveBy(moveX, moveY);
	}

	aggregateEnemies() {
		for (const enemy of this.enemies) {
			const dx = this.playerX - enemy.x;
			const dy = this.playerY - enemy.y;
			const angle = Math.atan2(dy, dx);
			const vx = Math.cos(angle) * 5;
			const vy = Math.sin(angle) * 5;
			enemy.x += vx;
			enemy.y += vy;
		}
	}

	spawnEnemy() {
		const enemy = new Enemy();
		const bounds = {
			x1: this.playerX - (this.ground.width / 2) - enemy.width,
			x2: this.playerX + (this.ground.width / 2) + enemy.width,
			y1: this.playerY - (this.ground.height / 2) - enemy.height,
			y2: this.playerY + (this.ground.height / 2) + enemy.height,
		};

		if (Math.random() < 0.5) {
			enemy.x = bounds.x1 + (Math.random() * this.ground.width);
			enemy.y = Math.random() < 0.5 ? bounds.y1 : bounds.y2;
		} else {
			enemy.x = Math.random() < 0.5 ? bounds.x1 : bounds.x2;
			enemy.y = bounds.y1 + (Math.random() * this.ground.height);
		}

		this.enemies.push(enemy);
		this.entities.addChild(enemy);
	}
}
