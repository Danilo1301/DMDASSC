import { generateUUID } from "three/src/math/MathUtils";
import Game from "../game/Game";
import TileItem from "./TileItem";
import TileItemInfo from "./TileItemInfo";
import TileItemRender from "./TileItemRender";

export class TileItemFactory
{
    private _game: Game

    private _tileItemInfoList: {[id: string]: TileItemInfo} = {}

    constructor(game: Game)
    {
        this._game = game
    }

    public init(): void
    {
        const wall0 = this.addTileItemInfo('wall0', new TileItemInfo(
            'Wall',
            'wall0',
            new Phaser.Math.Vector2(1, 1),
            1,
            1
        ))

        wall0.collision.isWall = true
    


        this.addTileItemInfo('fogao0', new TileItemInfo(
            'Fogao 2x1',
            'block4',
            new Phaser.Math.Vector2(1, 2),
            2,
            2
        ))

        this.addTileItemInfo('chao0', new TileItemInfo(
            'Chao 2x1',
            'tile4',
            new Phaser.Math.Vector2(2, 2),
            1,
            1
        ))

        console.log(this._tileItemInfoList)
    }

    public createTileItem(id: string)
    {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        const tileItem = new TileItem(tileItemInfo)

        return tileItem
    }

    public addTileItemInfo(id: string, tileItemInfo: TileItemInfo)
    {
        tileItemInfo.id = id

        this._tileItemInfoList[id] = tileItemInfo

        return tileItemInfo
    }

    public hasTileItemInfo(id: string): boolean
    {
        return this._tileItemInfoList[id] != undefined
    }

    public getTileItemInfo(id: string): TileItemInfo
    {
        return this._tileItemInfoList[id]
    }

    public createTileItemRender(id: string)
    {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        const tileItemRender = new TileItemRender(
            this.getGame().getGameScene(),
            tileItemInfo
        )

        return tileItemRender
    }

    public getGame(): Game
    {
        return this._game
    }
}