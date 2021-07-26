import Tile from "@cafemania/tile/Tile";
import { generateUUID } from "three/src/math/MathUtils";
import TileItemInfo, { TileItemType } from "./TileItemInfo";
import TileItemRender from "./TileItemRender";

export enum TileItemDirection
{
    FRONT,
    BACK_FLIPPED,
    BACK,
    FRONT_FLIPPED,
}

export default class TileItem
{

    private _tileItemInfo: TileItemInfo

    private _tile!: Tile

    private _id: string

    private _tileItemRender?: TileItemRender

    private _direction: TileItemDirection = TileItemDirection.FRONT

    private _currentAnim: number = 0

    constructor(tileItemInfo: TileItemInfo)
    {
        this._id = generateUUID()
        this._tileItemInfo = tileItemInfo
    }

    public getTile(): Tile
    {
        return this._tile
    }

    public isInAnyTile(): boolean
    {
        return this._tile != undefined
    }

    public getTileItemInfo(): TileItemInfo
    {
        return this._tileItemInfo
    }

    public get direction(): TileItemDirection { return this._direction }
    public set direction(value) { this._direction = value }

    public render(): void
    {
        if(!this._tileItemRender)
        {
            const tileItemRender = this._tileItemRender = this.getGame().tileItemFactory.createTileItemRender(this._tileItemInfo.id)
            tileItemRender.setTileItem(this)

            const scene = this.getScene()
            const layer = this._tileItemInfo.type == TileItemType.FLOOR ? scene.groundLayer : scene.objectsLayer

            tileItemRender.setSceneLayer(layer)

            setInterval(() => {
                this._currentAnim++
                if(this._currentAnim >= this._tileItemInfo.sprites) this._currentAnim = 0
            }, 1000)
        }
        
        const position = this._tile.position
        const isFlipped = this._direction == TileItemDirection.FRONT_FLIPPED || this._direction == TileItemDirection.BACK_FLIPPED
        const isBack = this._direction == TileItemDirection.BACK || this._direction == TileItemDirection.BACK_FLIPPED
        
        this._tileItemRender.setFlipSprites(isFlipped)
        this._tileItemRender.setSprite(this._currentAnim)
        
        if(this._tileItemInfo.layers > 1)
            this._tileItemRender.setLayer(isBack ? 1 : 0)

        const newRotationOffset = new Phaser.Math.Vector2(0, 0)
        const offsetPos = TileItem.getOffsetByDirection(this._tileItemInfo.size.x, this._tileItemInfo.size.y, this._direction)
        const newPos = Tile.getPosition(offsetPos.x, offsetPos.y)

        newRotationOffset.x = newPos.x
        newRotationOffset.y = newPos.y
     
        this._tileItemRender.setPosition(position.x + newRotationOffset.x, position.y + newRotationOffset.y)
    }

    public setTile(tile: Tile): void
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

    public rotate(): void
    {
        let n = 0;
        let canRotate = false;
        let rotateTo = this.direction + 1

        while(!canRotate || n < 4)
        {
            let newDir = (rotateTo + n)%4
            n++

            const canBePlaced = this._tile.getWorld().canTileItemBePlaced(this, this._tile.x, this._tile.y, newDir)

            if(canBePlaced)
            {
                rotateTo = newDir
                canRotate = true
                break
            }
        }

        if(canRotate)
        {
            console.log("Direction changed")
            this.direction = rotateTo
        } else {
            console.warn("Cant rotate")
        }
    }

    /*
        Do   not       ask
            me   how  I   made     this
    */
    public static getOffsetByDirection(sizeX: number, sizeY: number, direction: TileItemDirection)
    {
        if(direction == 1)
        {
            return {
                x: (sizeX-1),
                y: (sizeX-1)
            }
        }
    
        if(direction == 2)
        {
            return {
                x: 0,
                y: -(sizeY-1 - (sizeX-1))
            }
        }
    
        if(direction == 3)
        {
            return {
                x: (sizeX-1) + ((sizeY-1) - (sizeX-1)),
                y: (sizeX-1)
            }
        }
    
        return {
            x: 0,
            y: 0
        }
    }
}