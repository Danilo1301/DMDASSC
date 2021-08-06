import Player from "@cafemania/player/Player"
import TileItem, { TileItemDirection } from "./TileItem"
import { TileItemType } from "./TileItemInfo"
import TileItemTable from "./TileItemTable"

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

    public getPlayerSitting()
    {
        return this._playerSitting!
    }

    public setReserved(value: boolean)
    {
        this._reserved = value
    }

    public hasTableInFront()
    {
        return this.getTableInFront() != undefined
    }

    public getTableInFront()
    {
        const tile = this.getTileInDirection(this.direction)

        console.log(tile)

        if(!tile) return

        for (const tileItem of tile.getTileItems()) {
            if(tileItem.getTileItemInfo().type == TileItemType.TABLE) return tileItem as TileItemTable
            
        }
    }

}