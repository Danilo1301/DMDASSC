import Dish from "@cafemania/dish/Dish";
import DishPlate from "@cafemania/dish/DishPlate";
import { GameScene } from "@cafemania/scenes/GameScene";
import { TileItem } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

export class CounterData
{
    public dish: Dish | null = null
    public amount: number = 0

    public serialize()
    {
        return {
            dish: this.dish?.id || null,
            amount: this.amount
        }
    }
}

export class TileItemCounter extends TileItem
{
    private _data = new CounterData()

    private _dishPlate?: DishPlate

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public setDish(dish: Dish)
    {
        this._data.dish = dish
        this._data.amount = dish.servings

        GameScene.Instance?.drawWorldText(`set dish`, this.getPosition())
    }

    public addDish(dish: Dish)
    {
        if(this.isEmpty())
        {
            this.setDish(dish)
            return
        }

        this._data.amount += dish.servings
    }

    public isEmpty()
    {
        return this._data.dish == null
    }

    public getDish()
    {
        return this._data.dish!
    }

    public update(delta: number)
    {
        super.update(delta)
    }

    public render(delta: number)
    {
        super.render(delta)

        if(!this.isEmpty())
        {
            if(!this._dishPlate)
            {
                const h = 20

                const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h))

                this._dishPlate = new DishPlate(this._data.dish!)
                this._dishPlate.setPosition(position.x, position.y) 
                this._dishPlate.setDepth(position.y + h)
            }
        }
        else
        {
            if(this._dishPlate)
            {
                this._dishPlate.destroy()
                this._dishPlate = undefined
            }
        }
    }

    public serialize()
    {
        let json = super.serialize()

        json = Object.assign(json, {
            data: this._data.serialize()
        })

        return json
    }
}