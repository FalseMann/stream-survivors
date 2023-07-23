import {Container, Texture, TilingSprite} from 'pixi.js';
import {KeyManager} from './key-manager.js';
import {Enemy} from './enemy.js';

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
	keyManager: KeyManager;

	constructor(options: WorldOptions) {
		super();
		const groundTexture = Texture.from('Environment/Grass.png');
		this.entities = new Container();
		this.enemySpawnRate = 0.01;
		this.ground = new TilingSprite(groundTexture, options.width, options.height);
		this.playerX = options.width / 2;
		this.playerY = options.height / 2;
		this.addChild(this.ground);
		this.addChild(this.entities);
		this.keyManager = new KeyManager();
	}

	moveBy(x: number, y: number) {
		this.ground.tilePosition.x -= x;
		this.ground.tilePosition.y -= y;

		this.entities.x -= x;
		this.entities.y -= y;

		this.playerX += x;
		this.playerY += y;
	}

	tick(_delta: number) {
		const speed = 10;
		let moveX = 0;
		let moveY = 0;

		if (this.keyManager.up()) {
			moveY -= speed;
		}

		if (this.keyManager.right()) {
			moveX += speed;
		}

		if (this.keyManager.down()) {
			moveY += speed;
		}

		if (this.keyManager.left()) {
			moveX -= speed;
		}

		this.moveBy(moveX, moveY);

		if (Math.random() < this.enemySpawnRate) {
			this.spawnEnemy();
		}

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
		let x = 0;
		let y = 0;

		const enemy = new Enemy();
		const topLeft = {
			x: this.playerX - (this.ground.width / 2) - enemy.width,
			y: this.playerY - (this.ground.height / 2) - enemy.height,
		};
		const bottomRight = {
			x: this.playerX + (this.ground.width / 2) + enemy.width,
			y: this.playerY + (this.ground.height / 2) + enemy.height,
		};

		if (Math.random() < 0.5) {
			y = Math.random() < 0.5 ? topLeft.y : bottomRight.y;
			x = topLeft.x + (Math.random() * this.ground.width);
		} else {
			y = topLeft.y + (Math.random() * this.ground.height);
			x = Math.random() < 0.5 ? topLeft.x : bottomRight.x;
		}

		enemy.x = x;
		enemy.y = y;
		this.enemies.push(enemy);
		this.entities.addChild(enemy);
	}
}
