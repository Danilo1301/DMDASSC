import Dish from "@cafemania/dish/Dish";
import DishPlate from "@cafemania/dish/DishPlate";
import { GameScene } from "@cafemania/scenes/GameScene";
import { WorldEvent } from "@cafemania/world/World";
import { TileItem } from "./TileItem";
import { TileItemCounter } from "./TileItemCounter";
import { TileItemInfo } from "./TileItemInfo";

export class StoveData
{
    public cookingDish?: string

    public startedAt: number = -1

    public serialize()
    {
        return {
            cookingDish: this.cookingDish,
            startedAt: this.startedAt
        }
    }
}

export class TileItemStove extends TileItem
{
    private _data = new StoveData()

    private _dishPlate?: DishPlate

    private _prevDishReadyState: boolean = false

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)

        this.events.on("pointerup", () =>
        {
            this.startCookingSomething()
        })

        console.log(this)
    }

    public isCooking() { return this._data.cookingDish != undefined }

    public startCookingSomething()
    {
        
        if(this.isCooking())
        {
            if(this.isDishReady())
            {
                GameScene.Instance?.drawWorldText(`Dish served`, this.getPosition())

                const result = this.sendDishToCounter()
                
                if(!result) GameScene.Instance?.drawWorldText(`No empty counters`, this.getPosition())


                return
            }

            GameScene.Instance?.drawWorldText(`Already cooking`, this.getPosition(), 0xff0000)
            return
        }

        const dishFactory = this.getTile().getWorld().getGame().getDishItemFactory()
        const food = dishFactory.getDish(Math.random() >= 0.5 ? "dish1" : "dish2")

        this.startCook(food)

        GameScene.Instance?.drawWorldText(`Started cooking '${food.name}'`, this.getPosition())
    }


    private getAvaliableCounters()
    {
        let counters = this.getWorld().getCounters()

        counters = counters.filter(counter => {
            if(counter.isEmpty()) return true

            if(counter.getDish().id == this.getCookingDish().id) return true

            return false
        })

        return counters
    }

    private sendDishToCounter()
    {
        const counters = this.getAvaliableCounters()

        if(counters.length == 0) return false

        const counter = counters[0]
        counter.addDish(this.getCookingDish())
        counter.setAsUpdated()

        
        this.clearDish()

        return true
    }

    public startCook(dish: Dish)
    {
        this._data.cookingDish = dish.id
        this._data.startedAt = new Date().getTime()

        this.getWorld().events.emit(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, this, dish)
        this.setAsUpdated()
    }

    public getCookingDish()
    {
        return this.getWorld().getGame().getDishItemFactory().getDish(this._data.cookingDish!)
    }

    public clearDish()
    {
        this._data.cookingDish = undefined
        this._data.startedAt = -1
    }


    public isDishReady()
    {
        const now = Date.now()
        const delta = now - this._data.startedAt

        return (delta >= this.getCookingDish().cookTime)
    }

    private onDishReady()
    {
        GameScene.Instance?.drawWorldText(`Dish is ready`, this.getPosition(), 0x00ff00)

        this.sendDishToCounter()
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.isCooking())
        {
            const isReady = this.isDishReady()

            if(this._prevDishReadyState != isReady)
            {
                this._prevDishReadyState = isReady
    
                if(isReady) this.onDishReady()
            }
        }
        
    }

    public render(delta: number)
    {
        super.render(delta)

        if(this.isCooking())
        {
            if(!this._dishPlate)
            {
                const h = 20

                const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h))

                this._dishPlate = new DishPlate(this.getCookingDish())
                this._dishPlate.setPosition(position.x, position.y) 
                this._dishPlate.setDepth(position.y + h)
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