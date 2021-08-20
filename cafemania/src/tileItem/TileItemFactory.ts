import { Game } from "@cafemania/game/Game"
import { TileItemInfo, TileItemPlaceType, TileItemRotationType, TileItemType } from "@cafemania/tileItem/TileItemInfo"
import { TileItem } from "./TileItem"
import { TileItemDoor } from "./TileItemDoor"
import { TileItemRender } from "./TileItemRender"
import { TileItemWall } from "./TileItemWall"

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
            id: 'floor1',
            name: 'floor1',
            texture: 'floor/floor1',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 0)
        })

        this.addTileItemInfo({
            id: 'test_floor1',
            name: 'test_floor1',
            texture: 'floor/test_floor1',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 0)
        })

        this.addTileItemInfo({
            id: 'floorDecoration1',
            name: 'floorDecoration1',
            texture: 'floorDecoration/floorDecoration1',
            type: TileItemType.FLOOR_DECORATION,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 42)
        })

        this.addTileItemInfo({
            id: 'floorDecoration2',
            name: 'floorDecoration2',
            texture: 'floorDecoration/floorDecoration2',
            type: TileItemType.FLOOR_DECORATION,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(2, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 42)
        })

        this.addTileItemInfo({
            id: 'chair1',
            name: 'chair1',
            texture: 'chair/chair1',
            type: TileItemType.FLOOR_DECORATION,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(2, 4),
            extraLayers: 1,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 97)
        })

        this.addTileItemInfo({
            id: 'wall1',
            name: 'wall1',
            texture: 'wall/wall1',
            type: TileItemType.WALL,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 252)
        })

        this.addTileItemInfo({
            id: 'door1',
            name: 'door1',
            texture: 'door/door1',
            type: TileItemType.DOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(2, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 215)
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

        if(tileItemInfo.type == TileItemType.WALL) return new TileItemWall(tileItemInfo)
        if(tileItemInfo.type == TileItemType.DOOR) return new TileItemDoor(tileItemInfo)
        //if(tileItemInfo.type == TileItemType.STOVE) return new TileItemStove(tileItemInfo)
        //if(tileItemInfo.type == TileItemType.COUNTER) return new TileItemCounter(tileItemInfo)
        //if(tileItemInfo.type == TileItemType.TABLE) return new TileItemTable(tileItemInfo)

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