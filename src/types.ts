import {type Spritesheet} from 'pixi.js';

export type GameObject = {
	sprites: Spritesheet;
	constructor(options: GameObjectOptions): GameObject;
};

export type GameObjectOptions = {
	sprites: Spritesheet;
};
