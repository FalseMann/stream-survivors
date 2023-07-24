import {Howl} from 'howler';
import {Container, Text, Texture, TilingSprite} from 'pixi.js';
import {z} from 'zod';
import {Enemy} from './entities/enemy.js';
import {Player} from './entities/player.js';
import {sprite as impactSprite} from './sounds/impact.json';
import {sprite as likirSprite} from './sounds/likir.json';
import {KeyManager} from './util/key-manager.js';

export type WorldOptions = {
	height: number;
	width: number;
};

const soundSpriteSchema = z.record(z.tuple([z.number(), z.number()]));

const bgm = new Howl({
	src: ['sounds/bgm.wav'],
	loop: true,
	volume: 0.05,
});
const impact = new Howl({
	src: ['sounds/impact.mp3'],
	sprite: soundSpriteSchema.parse(impactSprite),
	volume: 0.2,
});
const impactNoises = ['punch1', 'punch2', 'punch3'];
const likir = new Howl({
	src: ['sounds/likir.mp3'],
	sprite: soundSpriteSchema.parse(likirSprite),
	volume: 0.3,
});
const likirNoises = ['damn_it', 'dang_it', 'help', 'ouch', 'upos', 'stupid_chat', 'yrudt', 'next_game', 'one_sec'];

export class World extends Container {
	canDamagePlayer = true;
	canDash = true;
	enemies: Enemy[] = [];
	entities = new Container();
	enemySpawnRate = 0.01;
	ground: TilingSprite;
	player: Player;
	playerX: number;
	playerY: number;
	playerSpeed = 6;
	paused = false;
	keyManager = new KeyManager();
	bestTime = 0;
	timeElapsed = 0;
	timeText: Text;

	constructor({height, width}: WorldOptions) {
		super();
		const groundTexture = Texture.from('Environment/Grass.png');
		this.ground = new TilingSprite(groundTexture, width, height);
		this.player = new Player();
		this.player.position.set(width / 2, height / 2);
		this.playerX = width / 2;
		this.playerY = height / 2;

		this.addChild(this.ground);
		this.addChild(this.entities);
		this.addChild(this.player);

		this.timeText = new Text('0', {
			fill: 'white',
			fontFamily: 'Arial',
			fontSize: 32,
			fontWeight: 'bold',
			padding: 8,
		});

		this.addChild(this.timeText);
		this.timeText.anchor.set(0.5);
		this.timeText.position.set(width / 2, height - 40);

		bgm.play();

		window.addEventListener('keydown', event => {
			if (event.key === 'm') {
				bgm.mute(!bgm.mute());
				likir.mute(!likir.mute());
				impact.mute(!impact.mute());
			}

			if (event.key === 'p') {
				this.paused = !this.paused;
			}

			if (event.key === 'r') {
				this.reset();
			}

			if (event.key === '-') {
				this.enemySpawnRate = Math.max(this.enemySpawnRate - 0.01, 0);
			}

			if (event.key === '+') {
				this.enemySpawnRate = Math.min(this.enemySpawnRate + 0.01, 1);
			}

			if (event.key === ' ' && this.canDash) {
				this.dash();
			}
		});
	}

	dash() {
		this.canDash = false;
		this.canDamagePlayer = false;

		const dashAmount = 10;
		const dashDuration = 100;

		const dx = this.keyManager.right() ? dashAmount : (this.keyManager.left() ? -dashAmount : 0);
		const dy = this.keyManager.down() ? dashAmount : (this.keyManager.up() ? -dashAmount : 0);
		const interval = setInterval(() => {
			this.moveBy(dx, dy);
		}, 1);

		setTimeout(() => {
			this.canDamagePlayer = true;
			clearInterval(interval);
		}, dashDuration);

		setTimeout(() => {
			this.canDash = true;
		}, dashDuration * 8);
	}

	tick(_delta: number) {
		if (this.paused) {
			return;
		}

		this.timeElapsed += _delta / 60;
		this.bestTime = Math.max(this.timeElapsed, this.bestTime);
		this.timeText.text = `Best time: ${this.bestTime.toFixed(0)}`;
		this.enemySpawnRate = Math.min(this.enemySpawnRate + ((_delta / 60) * 0.001), 1);

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

			if (this.canDamagePlayer && Math.abs(dx) < enemy.width / 2 && Math.abs(dy) < enemy.height / 2) {
				// eslint-disable-next-line unicorn/prefer-dom-node-remove
				this.entities.removeChild(enemy);
				this.enemies.splice(i, 1);
				this.player.hp -= 10;
				impact.play(impactNoises[Math.floor(Math.random() * impactNoises.length)]);
				this.screenShake();

				if (Math.random() < 0.1) {
					likir.play(likirNoises[Math.floor(Math.random() * likirNoises.length)]);
				}

				if (this.player.hp <= 0) {
					this.reset();
				}
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

	reset() {
		this.player.hp = 100;
		this.entities.position.set(0, 0);
		this.enemySpawnRate = 0.01;
		this.playerX = this.ground.width / 2;
		this.playerY = this.ground.height / 2;
		this.player.position.set(this.ground.width / 2, this.ground.height / 2);
		this.timeElapsed = 0;
		for (const enemy of this.enemies) {
			// eslint-disable-next-line unicorn/prefer-dom-node-remove
			this.entities.removeChild(enemy);
		}

		this.enemies = [];
	}

	screenShake() {
		const shakeAmount = 10;
		const shakeDuration = 200;

		const interval = setInterval(() => {
			this.moveBy(-shakeAmount + (Math.random() * shakeAmount * 2), -shakeAmount + (Math.random() * shakeAmount * 2));
		}, 1);

		setTimeout(() => {
			clearInterval(interval);
		}, shakeDuration);
	}
}
