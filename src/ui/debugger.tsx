import {type JSX, createEffect, createSignal} from 'solid-js';
import {type Game} from '../game.js';

type DebuggerProps = {
	game: Game;
};
export function Debugger({game}: DebuggerProps): JSX.Element {
	const [enemyCount, setEnemyCount] = createSignal(0);
	const [playerX, setPlayerX] = createSignal(0);
	const [playerY, setPlayerY] = createSignal(0);
	const [hp, setHp] = createSignal(0);
	const [fps, setFps] = createSignal(0);
	const [visible, setVisible] = createSignal(false);

	function tick() {
		setFps(Math.round(game.app.ticker.FPS));
		setHp(game.world.player.hp);
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

	createEffect(() => {
		window.addEventListener('keydown', event => {
			if (event.key === '`') {
				setVisible(!visible());
			}
		});
	});
	return <pre style={`background-color:rgba(0, 0, 0, 0.5); color: #fff; margin: 0; font-size: 24px; display: ${visible() ? 'block' : 'none'}`}>
    FPS: {fps()}<br/>
    Player: X: {playerX()} Y: {playerY()}<br/>
		HP: {hp()}<br/>
    Enemies: {enemyCount()}<br/>
	</pre>;
}
