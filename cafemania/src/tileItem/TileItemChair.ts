import { Player } from "@cafemania/player/Player";
import { Tile } from "@cafemania/tile/Tile";
import { TileItem } from "./TileItem";
import { TileItemInfo, TileItemType } from "./TileItemInfo";
import { TileItemTable } from "./TileItemTable";

export class TileItemChair extends TileItem
{
    private _playerSitting?: Player

    private _isReserved: boolean = false

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public isEmpty()
    {
        return this._playerSitting == undefined
    }

    public isReserved()
    {
        return this._isReserved
    }

    public setPlayerSitting(player?: Player)
    {
        this._playerSitting = player
        this.setIsReserved(false)
    }

    public setIsReserved(value: boolean)
    {
        this._isReserved = value
    }

    public getPlayerSitting() {
        return this._playerSitting
    }

    public getTableInFront()
    {
        const offset = Tile.getOffsetFromDirection(this.direction)

        const tile = this.tile.getTileInOffset(offset.x, offset.y)

        if(!tile) return
        
        const tables = tile.getTileItemsOfType(TileItemType.TABLE)

        if(tables.length == 0) return

        return tables[0] as TileItemTable
    }
}