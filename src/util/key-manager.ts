export class KeyManager {
	keys: Record<string, boolean>;

	constructor() {
		this.keys = {};
		window.addEventListener('keydown', event => {
			this.keys[event.code] = true;
		});
		window.addEventListener('keyup', event => {
			this.keys[event.code] = false;
		});
	}

	isPressed(key: string): boolean {
		return this.keys[key];
	}

	down(): boolean {
		return this.isPressed('KeyS') || this.isPressed('ArrowDown');
	}

	left(): boolean {
		return this.isPressed('KeyA') || this.isPressed('ArrowLeft');
	}

	right(): boolean {
		return this.isPressed('KeyD') || this.isPressed('ArrowRight');
	}

	up(): boolean {
		return this.isPressed('KeyW') || this.isPressed('ArrowUp');
	}
}
