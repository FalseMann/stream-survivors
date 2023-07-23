import {Sprite, Texture} from 'pixi.js';
import {HpDisplay} from './ui/hp-display.js';

export class Player extends Sprite {
	hpContainer: HpDisplay;

	constructor() {
		const texture = Texture.from('Emotes/Kappa.png');
		super(texture);
		this.anchor.set(0.5);
		this.hpContainer = new HpDisplay();
		this.addChild(this.hpContainer);
	}

	get hp(): number {
		return this.hpContainer.hp;
	}

	set hp(hp: number) {
		this.hpContainer.hp = Math.max(hp, 0);
	}
}
