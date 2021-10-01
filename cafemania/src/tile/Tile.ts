import { GameScene } from "@cafemania/scenes/GameScene"
import { TileItem, TileItemSerializedData } from "@cafemania/tileItem/TileItem"
import { TileItemDoor } from "@cafemania/tileItem/TileItemDoor"
import { TileItemPlaceType, TileItemType } from "@cafemania/tileItem/TileItemInfo"
import { TileItemWall } from "@cafemania/tileItem/TileItemWall"
import { Direction } from "@cafemania/utils/Direction"
import { World } from "@cafemania/world/World"

export interface TileSerializedData
{
    x: number
    y: number
    tileItems: TileItemSerializedData[]
}

export class Tile
{
    public static SIZE = new Phaser.Math.Vector2(170, 85)

    public static getTilePosition(x: number, y: number)
    {
        const sx = (Tile.SIZE.x / 2) - 1
        const sy = (Tile.SIZE.y / 2) - 0.5

        return new Phaser.Math.Vector2(
            (x * sx) - (y * sx),
            (y * sy) + (x * sy)
        )
    }

    public static getTileGridBounds(sizex: number, sizey: number)
    {
        const rect = new Phaser.Geom.Rectangle()

        const tileAtTop = Tile.getTilePosition(0, 0)
        const tileAtLeft = Tile.getTilePosition(0, (sizey-1))
        const tileAtRight = Tile.getTilePosition((sizex-1), 0)
        const tileAtBottom = Tile.getTilePosition((sizex-1), (sizey-1))

        rect.top = tileAtTop.y

        rect.left = tileAtLeft.x
        rect.right = tileAtRight.x + (Tile.SIZE.x - 1)

        rect.bottom = tileAtBottom.y + (Tile.SIZE.y - 1)

        return rect
    }

    public static getOffsetFromDirection(direction: Direction)
    {
        interface IOption
        {
            x: number
            y: number
        }

        const options = new Map<Direction, IOption>()

        options.set(Direction.NORTH, {x: 0, y: -1})
        options.set(Direction.SOUTH, {x: 0, y: 1})
        options.set(Direction.EAST, {x: 1, y: 0})
        options.set(Direction.WEST, {x: -1, y: 0})

        options.set(Direction.SOUTH_EAST, {x: 1, y: 1})
        options.set(Direction.NORTH_WEST, {x: -1, y: -1})
        options.set(Direction.NORTH_EAST, {x: 1, y: -1})
        options.set(Direction.SOUTH_WEST, {x: -1, y: 1})

        return options.get(direction)!
    }

    public static getDirectionFromOffset(x: number, y: number)
    {
        const options = new Map<string, Direction>()

        options.set(`0:-1`, Direction.NORTH)
        options.set(`0:1`, Direction.SOUTH)
        options.set(`1:0`, Direction.EAST)
        options.set(`-1:0`, Direction.WEST)

        options.set(`1:1`, Direction.SOUTH_EAST)
        options.set(`-1:-1`, Direction.NORTH_WEST)
        options.set(`1:-1`, Direction.NORTH_EAST)
        options.set(`-1:1`, Direction.SOUTH_WEST)

        const find = `${x}:${y}`

        if(!options.has(find)) throw "Invalid offset"

        return options.get(find)!
    }

    public static getClosestTile(position: Phaser.Math.Vector2, tiles: Tile[])
    {
        let closestTile = tiles[0]

        for (const tile of tiles)
        {
            if(tile == closestTile) continue

            const tileDistance = Phaser.Math.Distance.BetweenPoints(position, tile.getPosition())
            const closestTileDistance = Phaser.Math.Distance.BetweenPoints(position, closestTile.getPosition())

            if(tileDistance < closestTileDistance)
            {
                closestTile = tile
            }
        }
        
        return closestTile
    }

    private _position = new Phaser.Math.Vector2()

    private _sprite?: Phaser.GameObjects.Sprite

    private _x: number

    private _y: number

    private _tileItems: TileItem[] = []

    private _world: World

    constructor(world: World, x: number, y: number)
    {
        this._world = world
        this._x = x
        this._y = y

        const pos = Tile.getTilePosition(x, y)

        this._position.set(pos.x, pos.y)
    }

    public get x() { return this._x; }
    public get y() { return this._y; }
    public get id() { return `${this.x}:${this.y}`; }
    public get world() { return this._world } 

    private getTileItemsThatOcuppesThisTile()
    {
        const items = this.world.grid.getCell(this.x, this.y).ocuppiedByItems

        return items.map(item =>
        {
            const cell = item.getOriginCell()
            const tile = this.world.getTile(cell.x, cell.y)

            return tile.getTileItem(item.id)!
        })
    }

    public get isSideWalk() { return this.world.isTileInSideWalk(this); }

    public get isWalkable() {
        const tileItems = this.getTileItemsThatOcuppesThisTile()
    
        for (const tileItem of tileItems)
        {
            if(tileItem.getInfo().type == TileItemType.WALL)
            {
                const wall = tileItem as TileItemWall

                if(wall.getDoorInFront())
                {
                    return true
                }
            }

            if(
                tileItem.getInfo().placeType == TileItemPlaceType.FLOOR
                && tileItem.getInfo().type != TileItemType.FLOOR
                && tileItem.getInfo().type != TileItemType.DOOR
            ) return false

            
        }
        
        return true
    }

    public get hasDoor() { return this.getDoor() != undefined; }

    public getDoor() {
        const doors = this.getTileItemsOfType(TileItemType.DOOR)
        return doors[0] as TileItemDoor
    }

    public getTileInOffset(x: number, y: number): Tile | undefined {
        const world = this.world;
        const findX = this.x + x
        const findY = this.y + y

        if(!world.hasTile(findX, findY)) return

        return world.getTile(findX, findY)
    }

    public getAdjacentTiles() {
        const directions = [Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST]
        const tiles: Tile[] = []

        for (const direction of directions) {
            const offset = Tile.getOffsetFromDirection(direction)
            const tile = this.getTileInOffset(offset.x, offset.y)

            if(tile) tiles.push(tile)
        }

        return tiles
    }

    public getTileItemsOfType(type: TileItemType)
    {
        const tileItems: TileItem[] = []

        this.tileItems.map(tileItem =>
        {
            if(tileItem.getInfo().type == type) tileItems.push(tileItem)
        })

        return tileItems
    }

    public getPosition()
    {
        const position = this._position

        return new Phaser.Math.Vector2(position.x, position.y) 
    }

    public getCenterPosition()
    {
        const position = this.getPosition()

        return new Phaser.Math.Vector2(position.x, position.y)
    }

    public update(delta: number)
    {
        this.tileItems.map(tileItem => tileItem.update(delta))
    }
    
    public render(delta: number)
    {
        const scene = GameScene.Instance

        const position = this.getPosition()

        if(!this._sprite) 
        {
            /*
            this._sprite = scene.add.sprite(0, 0, 'tile1')
            this._sprite.setAlpha(0)
            this._sprite.setDepth(0)
            this._sprite.setOrigin(0)
            this._sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
            */
        }
        
        this._sprite?.setPosition(position.x - Math.ceil(Tile.SIZE.x/2), position.y - Math.ceil(Tile.SIZE.y/2))

        this.tileItems.map(tileItem => tileItem.render(delta))
    }
    
    public get tileItems() { return this._tileItems; }

    public addTileItem(tileItem: TileItem) {
        this._tileItems.push(tileItem)

        tileItem.setTile(this)
        tileItem.onAddedToTile(this)
    }

    public getTileItem(id: string): TileItem | undefined {
        const ts = this.tileItems.filter(tileItem => tileItem.id == id);
        if(ts.length > 0) return ts[0];
        return
    }

    public serialize() {
        const tileItems = this.tileItems.map(tileItem => tileItem.serialize())

        const json: TileSerializedData = {
            x: this.x,
            y: this.y,
            tileItems: tileItems
        }

        return json
    }
}