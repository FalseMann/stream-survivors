import {render} from 'solid-js/web';
import UI from './ui/index.jsx';
import {Game} from './game.js';

const game = await Game.create();

const gameContainer = document.querySelector('#game');
const uiContainer = document.querySelector('#ui');

if (gameContainer === null) {
	throw new Error('Could not find Game container');
}

if (uiContainer === null) {
	throw new Error('Could not find UI container');
}

render(() => <UI game={game} />, uiContainer);
gameContainer.append(game.app.view);
