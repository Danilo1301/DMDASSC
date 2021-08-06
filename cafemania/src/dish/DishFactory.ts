import Game from "@cafemania/game/Game"
import Dish from "./Dish"

export default class DishFactory
{
    private _game: Game

    private _dishList: {[id: string]: Dish} = {}

    constructor(game: Game)
    {
        this._game = game

        this.init()
    }

    private init()
    {
        this.createDish({
            id: "dish1",
            name: "Dish 1",
            cookTime: 12000,
            texture: "dish1",
            servings: 10,
            frames: {
                cooking: 2,
                eating: 2
            }
        })

        this.createDish({
            id: "dish2",
            name: "Dish 2",
            cookTime: 8000,
            texture: "dish2",
            servings: 10,
            frames: {
                cooking: 2,
                eating: 2
            }
        })
    }

    public createDish(dish: Dish)
    {
        this._dishList[dish.id] = dish
    }

    public getDishList()
    {
        return this._dishList
    }

    public getDish(id: string)
    {
        if(!this.hasDish(id)) throw `Invalid Dish ID '${id}'`

        return this._dishList[id]
    }

    public hasDish(id: string)
    {
        return this._dishList[id] != undefined
    }
}