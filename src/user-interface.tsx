import {type JSX} from 'solid-js';
import {Debugger} from './ui/debugger.jsx';
import {type Game} from './game.js';

type UiProps = {
	game: Game;
};

export default function ui({game}: UiProps): JSX.Element {
	return <main><Debugger game={game}/></main>;
}
