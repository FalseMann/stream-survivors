import {Sprite, Texture} from 'pixi.js';

const enemies = [
	'Emotes/DansGame.png',
	'Emotes/HotPokket.png',
	'Emotes/Jebaited.png',
	'Emotes/Kreygasm.png',
	'Emotes/LUL.png',
	'Emotes/ResidentSleeper.png',
	'Emotes/SMOrc.png',
	'Emotes/WutFace.png',
];

export class Enemy extends Sprite {
	constructor() {
		const texture = Texture.from(enemies[Math.floor(Math.random() * enemies.length)]);
		super(texture);
		this.anchor.set(0.5);
	}
}
