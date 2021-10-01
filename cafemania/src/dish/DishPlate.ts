import { GameScene } from "@cafemania/scenes/GameScene"
import { Dish } from "./Dish"

export enum DishPlateState {
    NONE,
    COOKING,
    EATING
}

export class DishPlate {

    private _state: DishPlateState = DishPlateState.NONE;
    private _dish: Dish;
    private _sprite: Phaser.GameObjects.Sprite;
    private _percentage: number = 0;

    constructor(dish: Dish) {
        this._dish = dish;

        /*
        const texture = scene.textures.get(dish.texture)

        texture.getFrameNames()

        console.log(texture.getFrameNames())

        if(texture.getFrameNames().length == 0)
        {
            const ntotalframes = dish.frames.cooking + dish.frames.eating + 1
            const rectSize = new Phaser.Geom.Rectangle(0, 0, )


            for (let i = 0; i < ntotalframes; i++)
            {
                
            }
        }*/

        const scene = GameScene.Instance;
        const texture = scene.textures.get(dish.texture);
        const image = texture.getSourceImage();

        const totalNumFrames = dish.frames.cooking + dish.frames.eating + 1;
        const cropRect = new Phaser.Geom.Rectangle(0, 0, image.width / totalNumFrames, image.height);

        const addTextureFrame = (ix: number, name: string) => {
            texture.add(name, 0, ix*cropRect.width, 0, cropRect.width, cropRect.height);
        }

        if(texture.getFrameNames().length == 0) {

            addTextureFrame(0, 'default');

            let i = 1;

            for (let index = 0; index < dish.frames.cooking; index++) {
                addTextureFrame(i, 'cook_' + index);
                i++;
            }

            for (let index = 0; index < dish.frames.eating; index++) {
                addTextureFrame(i, 'eat_' + index);
                i++;
            }
        }

        const sprite = this._sprite = scene.add.sprite(0, 0, dish.texture);
        sprite.setOrigin(0.5, 1);

        scene.objectsLayer.add(sprite);
    }

    public setState(state: DishPlateState) {
        this._state = state;
        this.updateSprites();
    }

    public setPercentage(value: number) {
        this._percentage = value;
        this.updateSprites();
    }

    private updateSprites() {
        this._sprite.setFrame(this.getFrameKey());
    }

    public getFrameKey() {
        if(this._state == DishPlateState.NONE) return 'default';

        const k = this._state == DishPlateState.EATING ? 'eat' : 'cook';
        const maxFrames = this._state == DishPlateState.EATING ? this._dish.frames.eating+1 : this._dish.frames.cooking;

        let frame = Math.round((maxFrames-1) * this._percentage);

        if(this._state == DishPlateState.EATING) {
            if(frame == 0) return 'default';
            frame--;
        }

        return `${k}_${frame}`;
    }

    public getPosition() {
        return new Phaser.Math.Vector2(this._sprite.x, this._sprite.y);
    }

    public setPosition(x: number, y: number) {
        this._sprite.setPosition(x, y);
    }

    public setDepth(depth: number) {
        this._sprite.setDepth(depth);
    }

    public destroy() {
        this._sprite.destroy();
    }
}