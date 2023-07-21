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
		this.app = new Application({
			hello: true,
			resizeTo: window,
		});
		this.player = new Player({sprites});
		this.world = new World({sprites, height: this.app.screen.height, width: this.app.screen.width});

		this.player.sprite.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

		this.app.stage.addChild(this.world.container);
		this.app.stage.addChild(this.player.sprite);

		const keys: Record<string, boolean> = {};
		window.addEventListener('keydown', (event: KeyboardEvent) => {
			keys[event.code] = true;
		});
		window.addEventListener('keyup', (event: KeyboardEvent) => {
			keys[event.code] = false;
		});

		this.app.ticker.add(() => {
			const speed = 10;

			if (keys.KeyW || keys.ArrowUp) {
				this.world.grass.tilePosition.y += speed;
			}

			if (keys.KeyA || keys.ArrowLeft) {
				this.world.grass.tilePosition.x += speed;
			}

			if (keys.KeyS || keys.ArrowDown) {
				this.world.grass.tilePosition.y -= speed;
			}

			if (keys.KeyD || keys.ArrowRight) {
				this.world.grass.tilePosition.x -= speed;
			}
		});
	}
}
