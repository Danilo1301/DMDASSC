import Dish from "@cafemania/dish/Dish";
import DishPlate from "@cafemania/dish/DishPlate";
import { TileItem } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

export class TileItemTable extends TileItem
{
    private _dish?: Dish

    private _dishPlate?: DishPlate

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public isEmpty()
    {
        return this._dish == undefined
    }

    public getDish()
    {
        return this._dish!
    }

    public clearDish()
    {
        return this._dish = undefined
    }

    public setDish(dish: Dish)
    {
        this._dish = dish
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
}