import TileItem from "@cafemania/tileItem/TileItem"
import World from "../world/World"
import Phaser from 'phaser'
import GameScene from "@cafemania/game/scene/GameScene";

export default class Tile
{
    private _id: string;

    private _x: number
    private _y: number

    private _tileItems: TileItem[] = []

    private _world: World

    private _position = new Phaser.Math.Vector2()

    //private _sprite?: Phaser.GameObjects.Sprite

    //private _debugText?: Phaser.GameObjects.BitmapText

    //public testOcuppied: boolean = true

    constructor(world: World, x: number, y: number)
    {
        this._world = world

        this._id = `${x}:${y}`
        this._x = x
        this._y = y

        const position = Tile.getPosition(x, y)

        this._position.x = position.x
        this._position.y = position.y
    }

    public get id(): string { return this._id }

    public get x(): number { return this._x }

    public get y(): number { return this._y}

    public get position(): Phaser.Math.Vector2 { return this._position }

    public getCenterPosition()
    {
        return new Phaser.Math.Vector2(
            this.position.x,
            this.position.y - Tile.SIZE.y/2
        )
    }

    public render()
    {
        const scene = this.getScene()
        const position = this._position

        /*
        if(!this._sprite) 
        {
            const scene = this.getScene()

            this._sprite = scene.add.sprite(0, 0, 'tile1')
            this._sprite.setAlpha(0.1)
            this._sprite.setDepth(0)

            scene.groundLayer?.add(this._sprite)
        }
        
        this._sprite.setPosition(position.x, position.y)
        */

        for (const tileItem of this._tileItems)
        {
            tileItem.render()
        }

        /*
        if(!this._debugText)
        {
            this._debugText = scene.add.bitmapText(0, 0, 'gem', `${this.id}`, 16).setOrigin(0.5);
        }

        const ocuppiedMap = this._world.getOccupiedTilesMap()

        this.testOcuppied = ocuppiedMap[`${this.x}:${this.y}`] === true

        if(this.testOcuppied)
        {
            this._debugText.setTint(0xff0000)
        } else {
            this._debugText.setTint(0xffffff)
        }

        this._debugText.setPosition(this.position.x, this.position.y)
        this._debugText.setDepth(10000)
        */
    }

    public addTileItem(tileItem: TileItem): void
    {
        tileItem.setTile(this)

        this._tileItems.push(tileItem)
    }

    public getTileItems(): TileItem[]
    {
        return this._tileItems
    }

    private getScene()
    {
        return GameScene.getScene()
    }

    public getWorld(): World
    {
        return this._world
    }

    public serialize()
    {
        return {
            x: this._x,
            y: this._y,
            items: this._tileItems.map(tileItem => tileItem.serialize())
        }
    }

    //---

    public static getGridBounds(sizeX: number, sizeY: number)
    {
        var left = 0
        var right = 0
        var top = 0
        var bottom = 0

        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                var pos = Tile.getPosition(x, y)

                if(pos.x < left) left = pos.x
                if(pos.x > right) right = pos.x

                if(pos.y > top) top = pos.y
                if(pos.y < bottom) bottom = pos.y
            }
        }

        left -= ((Tile.SIZE.x/2)-1)
        right += ((Tile.SIZE.x/2)-1)

        top += ((Tile.SIZE.y/2)-0.5)
        bottom -=((Tile.SIZE.y/2)-0.5)

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            width: Math.abs(left - right),
            height: Math.abs(top - bottom)
        }
    }

    public static getPosition(x: number, y: number)
    {
        const position = new Phaser.Math.Vector2(
            x * ((Tile.SIZE.x/2)-1),
            y * ((Tile.SIZE.y/2)-0.5)
        )

        position.y -= x * ((Tile.SIZE.y/2)-0.5)
        position.x += y * ((Tile.SIZE.x/2)-1)

        return position
    }
    

    public static SIZE = new Phaser.Math.Vector2(170, 85)
}