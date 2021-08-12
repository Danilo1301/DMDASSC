import Player from "@cafemania/player/Player"
import TileItem, { TileItemDirection } from "./TileItem"
import { TileItemType } from "./TileItemInfo"
import TileItemTable from "./TileItemTable"

export default class TileItemChair extends TileItem
{
    private _playerSitting?: Player

    private _reserved: boolean = false

    public get hasPlayerSitting(): boolean
    {
       return this._playerSitting != undefined
    }

    public get isReserved(): boolean
    {
       return this._reserved
    }

    public get hasTableInFront()
    {
        return this.getTableInFront() != undefined
    }

    public setPlayerSitting(player: Player | undefined)
    {
        this._playerSitting = player
    }

    public getPlayerSitting()
    {
        return this._playerSitting
    }

    public setReserved(value: boolean)
    {
        this._reserved = value
    }

    public getTableInFront()
    {
        const tile = this.getTileInDirection(this.direction)

        if(!tile) return

        for (const tileItem of tile.getTileItems()) {
            if(tileItem.getTileItemInfo().type == TileItemType.TABLE) return tileItem as TileItemTable 
        }
    }
}