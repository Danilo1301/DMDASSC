import Game from "@cafemania/game/Game"
import Food from "./Food"

export default class FoodFactory
{
    private _game: Game

    private _foodList: {[id: string]: Food} = {}

    constructor(game: Game)
    {
        this._game = game

        this.init()
    }

    private init()
    {
        this.createFood({
            id: "food1",
            name: "Food1",
            cookTime: 5000
        })
    }

    public createFood(food: Food)
    {
        this._foodList[food.id] = food
    }

    public getFood(id: string)
    {
        if(!this.hasFood(id)) throw `Invalid Food ID '${id}'`

        return this._foodList[id]
    }

    public hasFood(id: string)
    {
        return this._foodList[id] != undefined
    }
}