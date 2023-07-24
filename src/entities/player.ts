import {Sprite, Texture} from 'pixi.js';
import {HpDisplay} from './ui/hp-display.js';

export class Player extends Sprite {
	hpContainer: HpDisplay;
	isHighohh = false;

	constructor() {
		const texture = Texture.from('Cat/Smile.png');
		super(texture);
		this.anchor.set(0.5);
		this.hpContainer = new HpDisplay();
		this.addChild(this.hpContainer);
	}

	setIsHighohh(isHighohh: boolean) {
		this.isHighohh = isHighohh;

		if (isHighohh) {
			this.texture = Texture.from('Emotes/highohh.png');
		}
	}

	get hp(): number {
		return this.hpContainer.hp;
	}

	set hp(hp: number) {
		this.hpContainer.hp = Math.max(hp, 0);

		if (this.isHighohh) {
			return;
		}

		if (hp > 80) {
			this.texture = Texture.from('Cat/Smile.png');
		} else if (hp > 50) {
			this.texture = Texture.from('Cat/Weird.png');
		} else if (hp > 25) {
			this.texture = Texture.from('Cat/Sad.png');
		} else {
			this.texture = Texture.from('Cat/Mad.png');
		}
	}
}
