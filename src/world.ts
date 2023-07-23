import {Container, Texture, TilingSprite} from 'pixi.js';
import {Enemy} from './entities/enemy.js';
import {Player} from './entities/player.js';
import {KeyManager} from './util/key-manager.js';

export type WorldOptions = {
	height: number;
	width: number;
};

export class World extends Container {
	enemies: Enemy[] = [];
	entities = new Container();
	enemySpawnRate = 0.1;
	ground: TilingSprite;
	player: Player;
	playerContainer = new Container();
	playerX: number;
	playerY: number;
	playerSpeed = 7;
	keyManager = new KeyManager();

	constructor(options: WorldOptions) {
		super();
		const groundTexture = Texture.from('Environment/Grass.png');
		this.ground = new TilingSprite(groundTexture, options.width, options.height);
		this.player = new Player();
		this.player.position.set(options.width / 2, options.height / 2);
		this.playerContainer.addChild(this.player);
		this.playerX = options.width / 2;
		this.playerY = options.height / 2;

		this.addChild(this.ground);
		this.addChild(this.entities);
		this.addChild(this.playerContainer);
	}

	tick(_delta: number) {
		this.movePlayer();

		if (Math.random() < this.enemySpawnRate) {
			const enemy = this.spawnEnemy();
			this.enemies.push(enemy);
			this.entities.addChild(enemy);
		}

		this.aggregateEnemies();
	}

	moveBy(x: number, y: number): void {
		this.ground.tilePosition.x -= x;
		this.ground.tilePosition.y -= y;

		this.entities.x -= x;
		this.entities.y -= y;

		this.playerX += x;
		this.playerY += y;
	}

	movePlayer(): void {
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

	aggregateEnemies(): void {
		for (let i = 0; i < this.enemies.length; i++) {
			const enemy = this.enemies[i];
			const dx = this.playerX - enemy.x;
			const dy = this.playerY - enemy.y;
			const angle = Math.atan2(dy, dx);
			const vx = Math.cos(angle) * 5;
			const vy = Math.sin(angle) * 5;
			enemy.x += vx;
			enemy.y += vy;

			if (Math.abs(dx) < enemy.width / 2 && Math.abs(dy) < enemy.height / 2) {
				// eslint-disable-next-line unicorn/prefer-dom-node-remove
				this.entities.removeChild(enemy);
				this.enemies.splice(i, 1);
				this.player.hp -= 10;
			}
		}
	}

	spawnEnemy(): Enemy {
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

		return enemy;
	}
}
