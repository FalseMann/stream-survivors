import {Container, TilingSprite} from 'pixi.js';
import {Entity} from './entity.js';

export type WorldOptions = {
	height: number;
	width: number;
} & Entity;

export class World extends Entity {
	container: Container;
	grass: TilingSprite;

	constructor(options: WorldOptions) {
		super(options);
		this.container = new Container();
		this.grass = new TilingSprite(this.sprites.textures['Environment/Grass.png'], options.width, options.height);
		this.container.addChild(this.grass);
	}
}

