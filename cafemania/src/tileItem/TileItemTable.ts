import Dish from "@cafemania/dish/Dish"
import DishPlate from "@cafemania/dish/DishPlate"
import GameScene from "@cafemania/game/scene/GameScene"
import TileItem from "./TileItem"
import TileItemChair from "./TileItemChair"
import TileItemInfo, { TileItemType } from "./TileItemInfo"

export class TableData
{
    public dish: Dish | null = null

    public serialize()
    {
        return {
            dish: this.dish?.id
        }
    }
}

export default class TileItemTable extends TileItem
{
    private _data = new TableData()

    private _dishPlate?: DishPlate

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.hasDish())
        {
            if(!this._dishPlate)
            {
                const position = this.getPosition()

                this._dishPlate = new DishPlate(this.getDish())
                this._dishPlate.setPosition(position.x, position.y + 25) 
                this._dishPlate.setDepth(this.getDepth() + 1)
    
                GameScene.getScene().drawWorldText(`Received dish`, this.getPosition())

                console.log("yes, dish", this._dishPlate)
            }
            
        } else {
            if(this._dishPlate)
            {
                this._dishPlate.destroy()
                this._dishPlate = undefined
            }
        }
    }

    public clearDish()
    {
        this._data.dish = null
    }

    public getDish()
    {
        return this._data.dish!
    }

    public hasDish()
    {
        return this._data.dish != undefined
    }

    public setDish(dish: Dish)
    {
        this._data.dish = dish
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