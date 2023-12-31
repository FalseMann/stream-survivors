import {Application, Assets, type Spritesheet} from 'pixi.js';
import {World} from './world.js';

export class Game {
	static async create(): Promise<Game> {
		const sprites: Spritesheet = await Assets.load('spritesheet.json');
		return new Game(sprites);
	}

	app: Application<HTMLCanvasElement>;
	world: World;

	constructor(public sprites: Spritesheet) {
		this.app = new Application({height: 1080, width: 1920});
		this.world = new World({height: this.app.screen.height, width: this.app.screen.width});

		this.app.stage.addChild(this.world);

		this.app.ticker.add(delta => {
			this.world.tick(delta);
		});
	}
}
