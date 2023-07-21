import {type Spritesheet} from 'pixi.js';

export type EntityOptions = {
	sprites: Spritesheet;
};

export class Entity {
	sprites: Spritesheet;
	constructor(options: EntityOptions) {
		this.sprites = options.sprites;
	}
}
