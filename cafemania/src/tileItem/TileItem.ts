import { TileItemInfo, TileItemPlaceType, TileItemType } from "./TileItemInfo"
import { v4 as uuidv4 } from 'uuid';
import { TileItemRender } from "./TileItemRender";
import { Tile } from "@cafemania/tile/Tile";
import { GameScene } from "@cafemania/scenes/GameScene";
import { Direction } from "@cafemania/utils/Direction";

export class TileItem
{
    public events = new Phaser.Events.EventEmitter()

    private _tileItemInfo: TileItemInfo

    private _id: string

    private _tileItemRender?: TileItemRender

    private _tile?: Tile

    private _direction: Direction = Direction.SOUTH

    private _animIndex: number = 0
    
    private _layerIndex: number = 0

    constructor(tileItemInfo: TileItemInfo)
    {
        this._id = uuidv4()
        this._tileItemInfo = tileItemInfo
    }

    public get direction()
    {
        return this._direction
    }

    public get id()
    {
        return this._id
    }

    public getPosition()
    {
        return this.getTile().getPosition()
    }

    public setAnimIndex(value: number)
    {
        if(value != this._animIndex)
        {
            this._animIndex = value

            this.updateSprites()
        }
    }

    public getTileItemRender()
    {
        return this._tileItemRender
    }

    public getTile()
    {
        return this._tile!
    }

    public setTile(tile: Tile)
    {
        this._tile = tile
    }   

    public getInfo()
    {
        return this._tileItemInfo
    }

    public setDirection(direction: Direction)
    {
        const result = this.getTile().getWorld().setTileItemDirection(this, direction)

        if(result)
        {
            this._direction = direction
        }

        this.updateSprites()

        return result
    }

    public update(delta: number)
    {
        
    }

    public render(delta: number)
    {
        this.renderTileItemRender()
    }

    private renderTileItemRender()
    {
        const tile = this._tile

        if(!tile) return

        if(!this._tileItemRender)
        {
            this._tileItemRender = new TileItemRender(this.getInfo(), this)

            if(this.getInfo().placeType == TileItemPlaceType.WALL || this.getInfo().type == TileItemType.DOOR)
                this._tileItemRender.setDepth(-Tile.SIZE.y/3)
        
            this.setTileItemRenderSpritesToLayers()

            this.updateSprites()
        }
    }

    protected setTileItemRenderSpritesToLayers()
    {
        const scene = GameScene.Instance
        let layer = scene.objectsLayer

        if(this.getInfo().type == TileItemType.FLOOR) layer = scene.groundLayer

        this.getTileItemRender()!.getSprites().map(sprite =>
        {
            if(sprite.image) layer.add(sprite.image)
            if(sprite.collision) layer.add(sprite.collision)
        })
    }

    protected updateSprites()
    {
        //console.log(`[TileItem : ${this.getInfo().name}] updateSprites`)

        const tileItemRender = this._tileItemRender
        const tile = this._tile

        if(tileItemRender)
        {
            const os = TileItemRender.valuesFromDirection(this._direction)

            const changeLayer = this.direction == Direction.NORTH || this.direction == Direction.WEST

            tileItemRender.setRotation(os[0], os[1])
            tileItemRender.setLayer(this._animIndex, this._layerIndex + (changeLayer ? 1 : 0))

            if(tile)
            {
                const position = tile.getPosition()
                tileItemRender.setPosition(new Phaser.Math.Vector2(position.x, position.y))
            }
        }
    }

    private destroySprites()
    {

    }
}