import Dish from "@cafemania/dish/Dish"
import DishPlate from "@cafemania/dish/DishPlate"
import GameScene from "@cafemania/game/scene/GameScene"
import TileItem from "./TileItem"
import TileItemChair from "./TileItemChair"
import TileItemInfo, { TileItemType } from "./TileItemInfo"

export class CounterData
{
    public dish: Dish | null = null

    public amount: number = 0

    public serialize()
    {
        return {
            dish: this.dish?.id,
            amount: this.amount
        }
    }
}

export default class TileItemCounter extends TileItem
{
    private _data = new CounterData()

    private _dishPlate?: DishPlate

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public update(delta: number)
    {
        super.update(delta)

        if(!this.isEmpty)
        {
            if(!this._dishPlate)
            {
                const position = this.getPosition()

                this._dishPlate = new DishPlate(this.getDish())
                this._dishPlate.setPosition(position.x, position.y + 25) 
                this._dishPlate.setDepth(this.getDepth() + 1)

                console.log("yes, dish", this._dishPlate)
            }

            
        }


        if(!this.isEmpty)
        {
            if(this._data.amount <= 0)
            {
                this.clearCounter()
            }
        }
        //--

        

        //--
    }

    public get isEmpty() { return this._data.dish == null }

    public clearCounter()
    {
        this._data.dish = null
        this._data.amount = 0

        if(this._dishPlate)
        {
            this._dishPlate.destroy()
            this._dishPlate = undefined
        }
    }

    public getDish()
    {
        return this._data.dish!
    }

    public addDish(dish: Dish)
    {
        this._data.dish = dish

        this._data.amount += dish.servings
    }

    public getOneDish(): Dish | undefined
    {
        if(this._data.amount <= 0) return

        this._data.amount--

        return this.getDish()
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