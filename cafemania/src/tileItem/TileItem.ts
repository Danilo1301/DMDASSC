import { TileItemInfo, TileItemType } from "./TileItemInfo"
import { v4 as uuidv4 } from 'uuid';
import { TileItemRender } from "./TileItemRender";
import { Tile } from "@cafemania/tile/Tile";
import { GameScene } from "@cafemania/scenes/GameScene";

export enum TileItemDirection
{
    FRONT,
    BACK_FLIPPED,
    BACK,
    FRONT_FLIPPED,
}

export class TileItem
{
    private _tileItemInfo: TileItemInfo

    private _id: string

    private _tileItemRender?: TileItemRender

    private _tile?: Tile

    private _direction: TileItemDirection = TileItemDirection.FRONT

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

    public setDirection(direction: TileItemDirection)
    {
        this._direction = direction

        const os = TileItemRender.valuesFromDirection(direction)

        this._tileItemRender?.setRotation(os[0], os[1])
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
        const scene = GameScene.Instance
        const tile = this._tile

        if(!tile) return

        if(!this._tileItemRender)
        {
            this._tileItemRender = new TileItemRender(this.getInfo())
            this._tileItemRender.setTileItem(this)
            this.setDirection(this._direction)

            let layer = scene.objectsLayer

            if(this.getInfo().type == TileItemType.FLOOR) layer = scene.groundLayer

            this._tileItemRender.getSprites().map(sprite => layer.add(sprite.image) )

            const position = tile.getPosition()
            this._tileItemRender.setPosition(new Phaser.Math.Vector2(position.x, position.y))
        }
    }
}