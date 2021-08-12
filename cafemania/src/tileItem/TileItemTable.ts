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

    private _eatingTimeElapsed: number = 0

    private _connectedChair?: TileItemChair

    private _eatTime: number = 0

    private _isWaitingForWaiter: boolean = false

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public getIsWaitingForWaiter()
    {
        return this._isWaitingForWaiter
    }
    
    public setIsWaitingForWaiter(value: boolean)
    {
        this._isWaitingForWaiter = value
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
    
                //GameScene.getScene().drawWorldText(`Received dish`, this.getPosition())

                console.log("yes, dish", this._dishPlate)
            }
            
            this._eatingTimeElapsed += delta

            if(this._eatingTimeElapsed >= this._eatTime)
            {
                this.clearDish()
                this.events.emit("finished_eating")

                this.getConnectedChair()?.getPlayerSitting().exitCafe()
            }
        } else {
            if(this._dishPlate)
            {
                this._dishPlate.destroy()
                this._dishPlate = undefined
            }
        }
    }

    public getConnectedChair()
    {
        const world = this.getWorld()

        const chairs = <TileItemChair[]> world.getAllTileItemsOfType(TileItemType.CHAIR)

        for (const chair of chairs)
        {
            if(chair.getTableInFront() == this)
            {
                this._connectedChair = chair

                return chair
            }
        }

        return this._connectedChair
    }

    public clearDish()
    {
        this._data.dish = null
        this._eatingTimeElapsed = 0

        this.getConnectedChair()
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
        this._eatTime = Math.random()*5000+8000

        const c = this.getConnectedChair()

        console.log(c)
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