import Dish from "@cafemania/dish/Dish";
import DishPlate from "@cafemania/dish/DishPlate";
import { GameScene } from "@cafemania/scenes/GameScene";
import { TileItem } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

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

                this.clearDish()

                return
            }

            GameScene.Instance?.drawWorldText(`Already cooking`, this.getPosition(), "red")
            return
        }

        const dishFactory = this.getTile().getWorld().getGame().getDishItemFactory()
        const food = dishFactory.getDish(Math.random() >= 0.5 ? "dish1" : "dish2")

        this.startCook(food)

        GameScene.Instance?.drawWorldText(`Started cooking '${food.name}'`, this.getPosition())
    }

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
        this._data.cookingDish = null
        this._data.startedAt = -1
    }

    public isDishReady()
    {
        const now = new Date().getTime()
        const delta = now - this._data.startedAt

        return (delta >= this.getCookingDish().cookTime)
    }

    private onDishReady()
    {
        GameScene.Instance?.drawWorldText(`Dish is ready`, this.getPosition(), 'green')
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.isCooking())
        {
            if(this._prevDishReadyState != this.isDishReady())
            {
                this._prevDishReadyState = this.isDishReady()
    
                if(this._prevDishReadyState) this.onDishReady()
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

                this._dishPlate = new DishPlate(this._data.cookingDish!)
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
}