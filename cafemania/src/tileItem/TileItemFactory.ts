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
        /*
        todo: Allow extraLayers to be 0 instead of 1
        */

        const wall1 = this.addTileItemInfo('wall1', new TileItemInfo())
        wall1.texture = "wall1"
        wall1.size.set(1, 1)
        wall1.sprites = 1
        wall1.layers = 1
        wall1.extraLayers = 1
        wall1.collision.isWall = true

        const window1 = this.addTileItemInfo('window1', new TileItemInfo())
        window1.texture = "window1"
        window1.size.set(1, 2)
        window1.sprites = 1
        window1.layers = 1
        window1.extraLayers = 1
        window1.collision.isWall = true
        window1.collision.x = 20
        window1.collision.y = 70
        window1.collision.height = 35
        window1.collision.wallSize = 0

        const chair1 = this.addTileItemInfo('chair1', new TileItemInfo())
        chair1.texture = "chair1"
        chair1.size.set(1, 1)
        chair1.sprites = 2
        chair1.layers = 2
        chair1.extraLayers = 2
        chair1.collision.height = 110
        chair1.collision.x = 15
        chair1.collision.y = 15
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