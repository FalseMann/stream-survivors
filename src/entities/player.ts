import {Graphics, Sprite, Texture} from 'pixi.js';

export class Player extends Sprite {
	hp = 100;
	hpContainer: Graphics;
	hpEmptyContainer: Graphics;

	constructor() {
		const texture = Texture.from('Emotes/Kappa.png');
		super(texture);
		this.anchor.set(0.5);
		this.hpContainer = new Graphics();
		this.hpEmptyContainer = new Graphics();
		this.hpEmptyContainer.beginFill(0x00_00_00);
		this.hpEmptyContainer.drawRect(-50, 80, 100, 10);
		this.hpContainer.beginFill(0xFF_00_00);
		this.hpContainer.drawRect(-50, 80, 100, 10);
		this.addChild(this.hpEmptyContainer);
		this.addChild(this.hpContainer);
	}

	setHp(hp: number): void {
		this.hp = hp;
		this.hpContainer.width = Math.max(this.hp, 0);
	}
}
