import {Application, Assets, type Spritesheet} from 'pixi.js';
import {Player} from './player.js';
import {World} from './world.js';

export class Game {
	static async create(): Promise<Game> {
		const sprites: Spritesheet = await Assets.load('spritesheet.json');
		return new Game(sprites);
	}

	app: Application<HTMLCanvasElement>;
	player: Player;
	world: World;

	constructor(public sprites: Spritesheet) {
		this.app = new Application({height: 1080, width: 1920});
		this.player = new Player();
		this.world = new World({height: this.app.screen.height, width: this.app.screen.width});

		this.app.stage.addChild(this.world);
		this.app.stage.addChild(this.player);

		this.player.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

		this.app.ticker.add(delta => {
			this.world.tick(delta);
		});
	}
}
