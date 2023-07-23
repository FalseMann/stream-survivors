import {Container, Graphics} from 'pixi.js';

export class HpDisplay extends Container {
	hpContainer: Graphics;
	hpEmptyContainer: Graphics;

	constructor() {
		super();
		this.hpContainer = new Graphics();
		this.hpEmptyContainer = new Graphics();
		this.hpEmptyContainer.beginFill(0x00_00_00);
		this.hpEmptyContainer.drawRect(-50, 80, 100, 10);
		this.hpContainer.beginFill(0xFF_00_00);
		this.hpContainer.drawRect(-50, 80, 100, 10);

		this.addChild(this.hpEmptyContainer);
		this.addChild(this.hpContainer);
	}

	get hp(): number {
		return this.hpContainer.width;
	}

	set hp(hp: number) {
		this.hpContainer.width = Math.max(hp, 0);
	}
}
