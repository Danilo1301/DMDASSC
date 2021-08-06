import Game from "../game/Game";
import TileItem from "./TileItem";
import TileItemChair from "./TileItemChair";
import TileItemCounter from "./TileItemCounter";
import TileItemInfo, { TileItemPlaceType, TileItemRotationType, TileItemType } from "./TileItemInfo";
import TileItemRender from "./TileItemRender";
import TileItemStove from "./TileItemStove";

export class TileItemFactory
{
    private _game: Game

    private _tileItemInfoList: {[id: string]: TileItemInfo} = {}

    constructor(game: Game)
    {
        this._game = game

        this.init()
    }

    private init(): void
    {   
        this.addTileItemInfo({
            id: 'wall1',
            name: 'wall1',
            texture: 'wall/wall1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.WALL,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
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
            texture: 'wallDecoration/window1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.WALL_DECORATION,
            placeType: TileItemPlaceType.WALL,
            size: new Phaser.Math.Vector2(1,2),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
            collision: {
                isWall: true,
                wallSize: 0,
                x: 20,
                y: 75,
                height: 20
            }
        })

        this.addTileItemInfo({
            id: 'chair1',
            name: 'chair1',
            texture: 'chair/chair1',
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            type: TileItemType.CHAIR,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 2,
            layers: 2,
            extraLayers: 1,
            collision: {
                x: 28,
                y: 25,
                height: 80
            }
        })

        this.addTileItemInfo({
            id: 'stove2',
            name: 'stove2',
            texture: 'stove/stove2',
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            type: TileItemType.STOVE,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,2),
            sprites: 2,
            layers: 2,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 40
            }
        })

        this.addTileItemInfo({
            id: 'stove1',
            name: 'stove1',
            texture: 'stove/stove1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.STOVE,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 40
            }
        })

        this.addTileItemInfo({
            id: 'table1',
            name: 'table1',
            texture: 'table/table1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.TABLE,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 40
            }
        })

        this.addTileItemInfo({
            id: 'counter1',
            name: 'counter1',
            texture: 'counter/counter1',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.COUNTER,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 40
            }
        })

   
         this.addTileItemInfo({
            id: 'floor1',
            name: 'floor1',
            texture: 'floor/floor1',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_ONLY,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 1,
            layers: 1,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })

        this.addTileItemInfo({
            id: 'floor2',
            name: 'floor2',
            texture: 'floor/floor2',
            rotationType: TileItemRotationType.SIDE_ONLY,
            type: TileItemType.FLOOR,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1,1),
            sprites: 2,
            layers: 2,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })


        this.addTileItemInfo({
            id: '2by3',
            name: '2by3',
            texture: 'floorDecoration/2by3',
            type: TileItemType.FLOOR_DECORATION, //----------------
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR, //----------------
            size: new Phaser.Math.Vector2(2,3),
            sprites: 1,
            layers: 2,
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            }
        })
    }

    public getTileItemInfoList()
    {
        return this._tileItemInfoList
    }

    public createTileItem(id: string): TileItem
    {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        if(tileItemInfo.type == TileItemType.CHAIR) return new TileItemChair(tileItemInfo)
        if(tileItemInfo.type == TileItemType.STOVE) return new TileItemStove(tileItemInfo)
        if(tileItemInfo.type == TileItemType.COUNTER) return new TileItemCounter(tileItemInfo)

        return new TileItem(tileItemInfo)
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