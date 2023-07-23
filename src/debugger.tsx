import {type JSX, createEffect, createSignal} from 'solid-js';
import {type Game} from './game.js';

type DebuggerProps = {
	game: Game;
};
export function Debugger({game}: DebuggerProps): JSX.Element {
	const [enemyCount, setEnemyCount] = createSignal<number>(0);
	const [playerX, setPlayerX] = createSignal(0);
	const [playerY, setPlayerY] = createSignal(0);
	const [fps, setFps] = createSignal(0);

	function tick() {
		setFps(Math.round(game.app.ticker.FPS));
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
	return <pre style='background-color:rgba(0, 0, 0, 0.5); color: #fff; margin: 0; font-size: 24px'>
    FPS: {fps()}<br/>
    Player: X: {playerX()} Y: {playerY()}<br/>
    Enemies: {enemyCount()}<br/>
	</pre>;
}
