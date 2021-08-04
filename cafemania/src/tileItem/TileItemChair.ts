import TileItem from "./TileItem"

export default class TileItemChair extends TileItem
{
    private _ocuppied: boolean = false

    public getIsOcuppied(): boolean
    {
       return this._ocuppied
    }

    public setOcuppied(value: boolean)
    {
        this._ocuppied = value
    }

}