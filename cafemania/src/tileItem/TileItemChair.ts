import Player from "@cafemania/player/Player"
import TileItem, { TileItemDirection } from "./TileItem"

export default class TileItemChair extends TileItem
{
    private _playerSitting?: Player

    private _reserved: boolean = false

    public getIsReserved(): boolean
    {
       return this._reserved
    }

    public getIsOcuppied(): boolean
    {
       return this._playerSitting != undefined
    }

    public setPlayerSitting(player: Player)
    {
        this._playerSitting = player
    }

    public setReserved(value: boolean)
    {
        this._reserved = value
    }

    public getTableInFront()
    {
        const tile = this.getTile()

        TileItemDirection

        const offset = [
            {x: 0, y: 1},
            {x: 1, y: 0}
        ]


        this.getTile().getWorld()

        return
    }

}