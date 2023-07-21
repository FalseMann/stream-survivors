import {Sprite} from 'pixi.js';
import {Entity, type EntityOptions} from './entity.js';

export class Player extends Entity {
	sprite: Sprite;

	constructor(options: EntityOptions) {
		super(options);
		const texture = this.sprites.textures['Emotes/Kappa.png'];
		this.sprite = new Sprite(texture);
		this.sprite.anchor.set(0.5);
	}
}
