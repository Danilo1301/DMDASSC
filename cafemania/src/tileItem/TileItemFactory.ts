import Game from "../game/Game";
import TileItem from "./TileItem";
import TileItemInfo, { TileItemPlaceType, TileItemRotationType, TileItemType } from "./TileItemInfo";
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

        this.addTileItemInfo({
            id: 'wall1',
            name: 'wall1',
            texture: 'wall1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.WALL,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 1,
            collision: {
                wallAtFront: true,
                isWall: true,
                wallSize: 32,
                x: 0,
                y: 0,
                height: 0
            }
        })

        this.addTileItemInfo({
            id: 'window1',
            name: 'window1',
            texture: 'window1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.WALL_OBJECT,
            placeType: TileItemPlaceType.WALL,
            size: new Phaser.Math.Vector2(1,2),
            sprites: 1,
            layers: 1,
            extraLayers: 1,
            collision: {
                isWall: true,
                wallSize: 0,
                x: 20,
                y: 70,
                height: 35
            }
        })

        this.addTileItemInfo({
            id: 'chair1',
            name: 'chair1',
            texture: 'chair1',
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            type: TileItemType.CHAIR,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 2,
            layers: 2,
            extraLayers: 2,
            collision: {
                x: 15,
                y: 15,
                height: 110
            }
        })

        this.addTileItemInfo({
            id: 'stove1',
            name: 'stove1',
            texture: 'stove1',
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            type: TileItemType.STOVE,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,2),
            sprites: 2,
            layers: 2,
            extraLayers: 1,
            collision: {
                x: 0,
                y: 0,
                height: 40
            }
        })

        this.addTileItemInfo({
            id: 'floor1',
            name: 'floor1',
            texture: 'floor1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.FLOOR,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 2,
            layers: 2,
            extraLayers: 1,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })

        this.addTileItemInfo({
            id: 'floor2',
            name: 'floor2',
            texture: 'floor2',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_ONLY,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 1,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })

        this.addTileItemInfo({
            id: '2by3',
            name: '2by3',
            texture: '2by3',
            type: TileItemType.STOVE, //----------------
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR, //----------------
            size: new Phaser.Math.Vector2(2,3),
            sprites: 1,
            layers: 2,
            extraLayers: 1,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })

    }

    public createTileItem(id: string): TileItem
    {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        const tileItem = new TileItem(tileItemInfo)

        return tileItem
    }

    public addTileItemInfo(tileItemInfo: TileItemInfo): TileItemInfo
    {
        this._tileItemInfoList[tileItemInfo.id] = tileItemInfo

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

    public createTileItemRender(id: string): TileItemRender
    {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        const tileItemRender = new TileItemRender(tileItemInfo)

        return tileItemRender
    }

    public getGame(): Game
    {
        return this._game
    }
}