import Tile from "@cafemania/world/tile/Tile";
import { generateUUID } from "three/src/math/MathUtils";
import TileCollisionFactory from "./TileCollisionFactory";
import TileItemInfo from "./TileItemInfo";
import TileItemRender from "./TileItemRender";

enum TileItemDirection
{
    FRONT,
    FRONT_FLIPPED,
    BACK,
    BACK_FLIPPED
}

export default class TileItem
{
    private _tileItemInfo: TileItemInfo

    private _tile!: Tile

    private _id: string

    private _tileItemRender?: TileItemRender

    private _collisionBox?: Phaser.GameObjects.Polygon

    private _direction: TileItemDirection = TileItemDirection.FRONT

    constructor(tileItemInfo: TileItemInfo)
    {
        this._id = generateUUID()
        this._tileItemInfo = tileItemInfo
    }

    public render()
    {
        if(!this._tileItemRender)
        {
            this._tileItemRender = this.getGame().tileItemFactory.createTileItemRender(this._tileItemInfo.id)
        }

        if(!this._collisionBox)
        {
            this.createCollisionBox()
        }

        const position = this._tile.getPosition()

        const isFlipped = this._direction == TileItemDirection.FRONT_FLIPPED || this._direction == TileItemDirection.BACK_FLIPPED

        this._collisionBox?.setPosition(
            position.x - (Tile.SIZE.x/2 * (isFlipped ? -1 : 1)),
            position.y - Tile.SIZE.y/2
        )

        this._collisionBox?.setScale(isFlipped ? -1 : 1, 1)
    }

    public setTile(tile: Tile)
    {
        this._tile = tile
    }

    private getGame()
    {
        return this._tile.getWorld().getGame()
    }

    private getScene()
    {
        return this.getGame().getGameScene()
    }

    public serialize()
    {
        return {
            id: this._id,
            tileItemInfo: this._tileItemInfo.id,
            direction: this._direction
        }
    }

    private createCollisionBox()
    {

        const scene = this.getScene()

        const isWall = this._tileItemInfo.collision.isWall
        const offsetX = isWall ? 35 : this._tileItemInfo.collision.x
        const offsetY = this._tileItemInfo.collision.y
        const height = isWall ? 250 : this._tileItemInfo.collision.height
        const alpha = 1
    

        const color = 0xfff00 * Math.random();
        const points = TileCollisionFactory.getBlockCollisionPoints(offsetX, offsetY, height);

        if(isWall) points.map(point => point.add(TileCollisionFactory.moveAlongXY(32, 0)))
     

        const collisionBox = this._collisionBox = scene.add.polygon(0, 0, points, color, alpha)
        collisionBox.setOrigin(0, 0)
        
        collisionBox.setInteractive(
            new Phaser.Geom.Polygon(points),
            Phaser.Geom.Polygon.Contains
        );

        const tileId = this._id;

        collisionBox.on('pointerdown', function (pointer) {
            console.log(tileId);
        });

        collisionBox.on('pointerover', function (pointer) {
            collisionBox.setFillStyle(0x000000, 0.5)
        });

        collisionBox.on('pointerout', function (pointer) {
            collisionBox.setFillStyle(color, alpha)
        });
    }
}