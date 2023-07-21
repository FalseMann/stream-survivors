import {Game} from './game.js';

const game = await Game.create();

document.body.append(game.app.view);
