import { Grid } from "./Grid"
import { Item } from "./Item"

export class Cell
{
    public readonly x: number
    public readonly y: number
    public readonly grid: Grid

    public ocuppiedByItems: Item[] = []
    
    private _item?: Item

    public get id()
    {
        return `${this.x}:${this.y}`
    }

    public get item()
    {
        return this._item
    }

    constructor(grid: Grid, x: number, y: number)
    {
        this.grid = grid
        this.x = x
        this.y = y
    }

    public setItem(item: Item)
    {
        this._item = item
    }

    public removeItem()
    {
        this._item = undefined
    }
}