import Food from "@cafemania/food/Food"
import GameScene from "@cafemania/game/scene/GameScene"
import TileItem from "./TileItem"
import TileItemInfo from "./TileItemInfo"

export class StoveData
{
    public cookingFood?: Food
    public startedAt: number = -1

    public serialize()
    {
        return {
            cookingFood: this.cookingFood?.id,
            startedAt: this.startedAt
        }
    }
}

export default class TileItemStove extends TileItem
{
    private _data = new StoveData()

    private _isFoodReady: boolean = false
    
    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)

        console.log(this)

        this.events.on("pointerup", () => {

            if(this._isFoodReady)
            {
                GameScene.getScene().drawWorldText(`Food served!`, this.getPosition())

                this.clearFood()

                this.setIsTransparent(false)

                return
            }

            const foodFactory = this.getGame().foodFactory
            
            if(this.isCooking)
            {
                GameScene.getScene().drawWorldText(`Already cooking`, this.getPosition(), "red")
                return
            }

            const food = foodFactory.getFood("food1")

            this.startCook(food)

            GameScene.getScene().drawWorldText(`Started cooking '${food.name}'`, this.getPosition())

            this.setIsTransparent(true)
        })
    }

    public get isCooking() { return this._data.cookingFood != undefined }

    public startCook(food: Food)
    {
        this._data.cookingFood = food
        this._data.startedAt = new Date().getTime()
    }

    public getCookingFood()
    {
        return this._data.cookingFood!
    }

    public clearFood()
    {
        this._isFoodReady = false
        this._data.cookingFood = undefined
        this._data.startedAt = -1
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.isCooking)
        {
            const now = new Date().getTime()

            const delta = now - this._data.startedAt

            if(delta >= this.getCookingFood().cookTime)
            {
                if(!this._isFoodReady)
                {
                    this._isFoodReady = true

                    GameScene.getScene().drawWorldText(`Food is ready!`, this.getPosition(), "green")
                }
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