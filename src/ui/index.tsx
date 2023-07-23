import {type JSX} from 'solid-js';
import {type Game} from '../game.js';
import {Debugger} from './debugger.jsx';

type UiProps = {
	game: Game;
};

export default function ui({game}: UiProps): JSX.Element {
	return <main><Debugger game={game}/></main>;
}
