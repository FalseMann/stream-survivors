import {Sprite, Texture} from 'pixi.js';

export class Player extends Sprite {
	constructor() {
		const texture = Texture.from('Emotes/Kappa.png');
		super(texture);
		this.anchor.set(0.5);
	}
}
