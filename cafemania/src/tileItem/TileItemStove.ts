import Dish from "@cafemania/dish/Dish"
import DishPlate from "@cafemania/dish/DishPlate"
import GameScene from "@cafemania/game/scene/GameScene"
import TileItem from "./TileItem"
import TileItemCounter from "./TileItemCounter"
import TileItemInfo, { TileItemType } from "./TileItemInfo"

export class StoveData
{
    public cookingDish: Dish | null = null

    public startedAt: number = -1

    public serialize()
    {
        return {
            cookingDish: this.cookingDish?.id || null,
            startedAt: this.startedAt
        }
    }
}

export default class TileItemStove extends TileItem
{
    private _data = new StoveData()

    private _isDishReady: boolean = false
    
    private _dishPlate?: DishPlate

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)

        console.log(this)

        this.events.on("pointerup", () => {

            if(this._isDishReady)
            {
                GameScene.getScene().drawWorldText(`Dish served!`, this.getPosition())

        
                const world = this.getTile().getWorld()

                const counters = <TileItemCounter[]> world.getAllTileItemsOfType(TileItemType.COUNTER) 

                const dish = this._data.cookingDish!

                for (const counter of counters) {
                    if(!counter.isEmpty)
                    {
                        if(counter.getDish().id != dish.id) continue
                    }

                    console.log(`found`, counter)

                    counter.addDish(dish)

                    break
                }

                this.clearDish()


                return
            }

            const dishFactory = this.getGame().dishFactory
            
            if(this.isCooking)
            {
                GameScene.getScene().drawWorldText(`Already cooking`, this.getPosition(), "red")
                return
            }

            const food = dishFactory.getDish(Math.random() >= 0.5 ? "dish1" : "dish2")

            this.startCook(food)

            GameScene.getScene().drawWorldText(`Started cooking '${food.name}'`, this.getPosition())

            this.setIsTransparent(true)
        })
    }

    public get isCooking() { return this._data.cookingDish != undefined }

    public startCook(dish: Dish)
    {
        this._data.cookingDish = dish
        this._data.startedAt = new Date().getTime()
    }

    public getCookingDish()
    {
        return this._data.cookingDish!
    }

    public clearDish()
    {
        this._isDishReady = false
        this._data.cookingDish = null
        this._data.startedAt = -1
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.isCooking)
        {
            if(!this._isDishReady) this.setIsTransparent(true)

            if(!this._dishPlate)
            {
                const position = this.getPosition()

                this._dishPlate = new DishPlate(this._data.cookingDish!)
                this._dishPlate.setPosition(position.x, position.y + 25) 
                this._dishPlate.setDepth(this.getDepth() + 1)
            }


            const now = new Date().getTime()

            const delta = now - this._data.startedAt

            if(delta >= this.getCookingDish().cookTime)
            {
                if(!this._isDishReady)
                {
                    this._isDishReady = true

                    GameScene.getScene().drawWorldText(`Dish is ready!`, this.getPosition(), "green")

                    this.setIsTransparent(false)
                }
            }
        } else {
     
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