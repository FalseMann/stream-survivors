import {Application, Assets, Sprite, type Spritesheet} from 'pixi.js';

const app = new Application<HTMLCanvasElement>({
	hello: true,
	resizeTo: window,
});

document.body.append(app.view);

const emotes: Spritesheet = await Assets.load('spritesheet.json');
const texture = emotes.textures['Emotes/Kappa.png'];
const sprite = new Sprite(texture);

sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;
sprite.anchor.set(0.5);

app.stage.addChild(sprite);

app.ticker.add(() => {
	sprite.rotation += 0.01;
});
