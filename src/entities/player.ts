import {Sprite, Texture} from 'pixi.js';

export class Player extends Sprite {
	hp = 100;
	constructor() {
		const texture = Texture.from('Emotes/Kappa.png');
		super(texture);
		this.anchor.set(0.5);
	}
}
