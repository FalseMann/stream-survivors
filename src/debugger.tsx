import {type JSX, createEffect, createSignal} from 'solid-js';
import {type Game} from './game.js';

type DebuggerProps = {
	game: Game;
};
export function Debugger({game}: DebuggerProps): JSX.Element {
	const [enemyCount, setEnemyCount] = createSignal<number>(0);
	const [playerX, setPlayerX] = createSignal(0);
	const [playerY, setPlayerY] = createSignal(0);

	function tick() {
		setPlayerX(game.world.playerX);
		setPlayerY(game.world.playerY);
		setEnemyCount(game.world.enemies.length);
	}

	createEffect(() => {
		game.app.ticker.add(tick);

		return () => {
			game.app.ticker.remove(tick);
		};
	});
	return <div style='background-color:rgba(0, 0, 0, 0.5); color: #fff'>
    Player X: {playerX()}<br/>
    Player Y: {playerY()}<br/>
    Enemies: {enemyCount()}<br/>
	</div>;
}
