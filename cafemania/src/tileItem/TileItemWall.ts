import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { TileItem, TileItemDirection } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

export class TileItemWall extends TileItem
{
    private _wallMask?: Phaser.GameObjects.Graphics

    private _canCreateWallMask: boolean = false

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public getDoorInFront()
    {
        const side = this.direction == TileItemDirection.FRONT_FLIPPED || this.direction == TileItemDirection.BACK_FLIPPED

        const offset = {
            x: side ? 1 : 0,
            y: side ? 0 : 1
        }

        console.log(offset)

        const tile = this.getTile().getTileInOffset(offset.x, offset.y)

        if(!tile) return
        if(!tile.hasDoor()) return

        return tile.getDoor()
    }

    public setWallHole(value: boolean)
    {
        this._canCreateWallMask = value
    }

    public render(delta: number)
    {
        super.render(delta)

        this.renderWallMask()
    }

    private renderWallMask()
    {
        const tileItemRender = this.getTileItemRender()

        if(!tileItemRender) return

        const scene = GameScene.Instance

        if(!this._canCreateWallMask && this._wallMask)
        {
            this._wallMask.destroy()
            this._wallMask = undefined
        }

        if(!this._canCreateWallMask) return

        if(!this._wallMask)
        {
            const points = TileCollisionFactory.getWallCollisionPoints(true, [0, 0], [70, 0], 0)

            const graphics = this._wallMask = scene.add.graphics()
            graphics.fillStyle(0xff0000)
            graphics.fillPoints(points)
            graphics.setAlpha(0)


            const mask = graphics.createGeometryMask()
            mask.setInvertAlpha()

            const sprites = tileItemRender.getSprites()
            sprites.map(sprite => sprite.image.setMask(mask))

            this.updateWallMask() 
        }
    }

    protected updateSprites()
    {
        super.updateSprites()

        this.updateWallMask() 
    }

    private updateWallMask()
    {
        const wallMask = this._wallMask

        if(!wallMask) return

        const direction = this.direction
        const flip = direction == TileItemDirection.FRONT_FLIPPED || direction == TileItemDirection.BACK_FLIPPED
        const position = this.getTile().getPosition()

        position.x -= Tile.SIZE.x/2 * (flip ? -1 : 1)
        position.y -= Tile.SIZE.y/2

        wallMask.setScale(flip ? -1 : 1, 1)

        wallMask.setPosition(position.x, position.y)
    }
}