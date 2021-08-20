import { GameScene } from "@cafemania/scenes/GameScene"
import { TileItem } from "@cafemania/tileItem/TileItem"
import { TileItemDoor } from "@cafemania/tileItem/TileItemDoor"
import { TileItemType } from "@cafemania/tileItem/TileItemInfo"
import World from "@cafemania/world/World"


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

    public get x()
    {
        return this._x
    }

    public get y()
    {
        return this._y
    }

    public get id()
    {
        return `${this.x}:${this.y}`
    }

    public getWorld()
    {
        return this._world
    }

    public hasDoor(): boolean
    {
        return this.getDoor() != undefined
    }

    public getDoor(): TileItemDoor
    {
        const doors = this.getTileItemsOfType(TileItemType.DOOR)

        return doors[0] as TileItemDoor
    }

    public getTileInOffset(x: number, y: number) : Tile | undefined
    {
        const world = this.getWorld()
        const findX = this.x + x
        const findY = this.y + y

        if(!world.hasTile(findX, findY)) return

        return world.getTile(findX, findY)
    }

    public getTileItemsOfType(type: TileItemType)
    {
        const tileItems: TileItem[] = []

        this.getTileItems().map(tileItem =>
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
        this.getTileItems().map(tileItem => tileItem.update(delta))
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

        this.getTileItems().map(tileItem => tileItem.render(delta))
    }
    
    public getTileItems()
    {
        return this._tileItems
    }

    public addTileItem(tileItem: TileItem)
    {
        this._tileItems.push(tileItem)

        tileItem.setTile(this)
    }

    public getTileItem(id: string): TileItem | undefined
    {
        const tileItems = this.getTileItems()

        const ts = tileItems.filter(tileItem => tileItem.id == id)

        if(ts.length > 0) return ts[0]
        
        return
    }
}