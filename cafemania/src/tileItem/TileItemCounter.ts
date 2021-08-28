import { Dish } from "@cafemania/dish/Dish";
import { DishPlate } from "@cafemania/dish/DishPlate";
import { TileItem } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

export class CounterData
{
    public dish?: string
    public amount: number = 0

    public serialize()
    {
        return {
            dish: this.dish,
            amount: this.amount
        }
    }
}

export class TileItemCounter extends TileItem
{
    private _data = new CounterData()

    private _dishPlate?: DishPlate

    private _waitersComing: number = 0

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public getAmountOfWaitersComing()
    {
        return this._waitersComing
    }

    public addWaiterComing()
    {
        this._waitersComing++
    }

    public removeWaiterComing()
    {
        this._waitersComing--
    }

    public getDishAmount()
    {
        return this._data.amount
    }

    public removeOneDish()
    {
        this.addDishAmount(-1)

        if(this._data.amount == 0) this._data.dish = undefined
    }

    public setDish(dish: Dish, amount?: number)
    {
        this._data.dish = dish.id
        this._data.amount = amount == undefined ? dish.servings : amount

        //GameScene.Instance?.drawWorldText(`set dish`, this.getPosition())
    }

    public addDishAmount(amount: number)
    {
        this._data.amount += amount
    }

    public addDish(dish: Dish)
    {
        if(this.isEmpty())
        {
            this.setDish(dish)
            return
        }

        this.addDishAmount(dish.servings)
    }

    public isEmpty()
    {
        return this._data.dish == null
    }

    public getDish()
    {
        return this.getWorld().game.getDishFactory().getDish(this._data.dish!)
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

                this._dishPlate = new DishPlate(this.getDish())
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

    public setData(data: CounterData)
    {
        this._data.dish = data.dish
        this._data.amount = data.amount
    }
}