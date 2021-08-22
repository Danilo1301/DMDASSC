import { GameScene } from "@cafemania/scenes/GameScene"
import Dish from "./Dish"

export default class DishPlate
{
    private _dish: Dish

    private _sprite: Phaser.GameObjects.Sprite

    constructor(dish: Dish)
    {
        this._dish = dish

        const scene = GameScene.Instance

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

        const texture = scene.textures.get(dish.texture)

        

        if(texture.getFrameNames().length == 0)
        {
            texture.add('1', 0, 0, 0, 138, 100)
        }

        const sprite = this._sprite = scene.add.sprite(0, 0, dish.texture)
        sprite.setFrame('1')
        sprite.setOrigin(0.5, 1)

        scene.objectsLayer.add(sprite)
    }

    public setPosition(x: number, y: number)
    {
        this._sprite.setPosition(x, y)
    }

    public setDepth(depth: number)
    {
        this._sprite.setDepth(depth)
    }

    public destroy()
    {
        this._sprite.destroy()
    }
}