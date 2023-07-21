import {Application, Assets, Sprite, TilingSprite, type Spritesheet, Container} from 'pixi.js';

const app = new Application<HTMLCanvasElement>({
	hello: true,
	resizeTo: window,
});

document.body.append(app.view);

const sprites: Spritesheet = await Assets.load('spritesheet.json');
const world = new Container();

app.stage.addChild(world);

const grass = new TilingSprite(sprites.textures['Environment/Grass.png'], app.screen.width, app.screen.height);
const player = new Sprite(sprites.textures['Emotes/Kappa.png']);

player.anchor.set(0.5);
player.position.set(app.screen.width / 2, app.screen.height / 2);

world.addChild(grass);
world.addChild(player);

const keys: Record<string, boolean> = {};
window.addEventListener('keydown', (event: KeyboardEvent) => {
	keys[event.code] = true;
});
window.addEventListener('keyup', (event: KeyboardEvent) => {
	keys[event.code] = false;
});

app.ticker.add(() => {
	const speed = 10;

	if (keys.KeyW) {
		grass.tilePosition.y += speed;
	}

	if (keys.KeyA) {
		grass.tilePosition.x += speed;
	}

	if (keys.KeyS) {
		grass.tilePosition.y -= speed;
	}

	if (keys.KeyD) {
		grass.tilePosition.x -= speed;
	}

	world.pivot.copyFrom(player.position);
	world.position.set(app.screen.width / 2, app.screen.height / 2);
});
