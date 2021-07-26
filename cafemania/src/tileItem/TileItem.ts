import Tile from "@cafemania/world/tile/Tile";
import { generateUUID } from "three/src/math/MathUtils";
import TileCollisionFactory from "./TileCollisionFactory";
import TileItemInfo from "./TileItemInfo";
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

    private _collisionBox?: Phaser.GameObjects.Polygon

    private _direction: TileItemDirection = TileItemDirection.FRONT

    private _currentAnim: number = 0

    constructor(tileItemInfo: TileItemInfo)
    {
        this._id = generateUUID()
        this._tileItemInfo = tileItemInfo
    }

    public getTile()
    {
        return this._tile
    }

    public isInAnyTile()
    {
        return this._tile != undefined
    }

    public getTileItemInfo()
    {
        return this._tileItemInfo
    }

    public setDirection(direction: TileItemDirection) {
    
        this._direction = direction

        return

        if(
            (direction == TileItemDirection.BACK || direction == TileItemDirection.BACK_FLIPPED) && (this._direction == TileItemDirection.FRONT || this._direction == TileItemDirection.FRONT_FLIPPED) ||
            (direction == TileItemDirection.FRONT || direction == TileItemDirection.FRONT_FLIPPED) && (this._direction == TileItemDirection.BACK || this._direction == TileItemDirection.BACK_FLIPPED)
        ) 
        {
            const d = (direction == TileItemDirection.FRONT) ? 1 : -1
            //const d = 1


            const tileSize = this._tileItemInfo.size
            const atTile = this._tile

            


            const world = this._tile.getWorld()
            const newTileOrigin = world.getTile(atTile.x + (d * (tileSize.x-1) ), atTile.y + (d * (tileSize.y-1) ))

            console.log("PUT IN ", newTileOrigin.x, newTileOrigin.y)

            console.log(world.canTileItemBePlaced(this, newTileOrigin.x, newTileOrigin.y, direction))

            /*
            dont forget to remove from _tileItems[]
            */
            newTileOrigin.addTileItem(this)

            //world.putTileItemInTile(this, newTileOrigin)

            console.log("change origin")
        }


        //this._direction = direction

       /// if(direction)
    }

    public get direction()
    {
        return this._direction
    }

    public render()
    {
        if(!this._tileItemRender)
        {
            const tileItemRender = this._tileItemRender = this.getGame().tileItemFactory.createTileItemRender(this._tileItemInfo.id)
        
            tileItemRender.tileItem = this

            setInterval(() => {
                this._currentAnim++

                if(this._currentAnim >= 2) this._currentAnim = 0
            })

        
            const speedo = Math.random()*500 + 500

            setInterval(() => {
                //this.rotate()

            }, speedo)


        }

        

        const position = this._tile.getPosition()

        const isFlipped = this._direction == TileItemDirection.FRONT_FLIPPED || this._direction == TileItemDirection.BACK_FLIPPED
        const isBack = this._direction == TileItemDirection.BACK || this._direction == TileItemDirection.BACK_FLIPPED
        

        this._tileItemRender.setFlipSprites(isFlipped)

        //this._tileItemRender.setSprite(this._currentAnim)
        if(this._tileItemInfo.layers > 1)
            this._tileItemRender.setLayer(isBack ? 1 : 0)

        const newRotationOffset = {
            x: 0,
            y: 0
        }

        const offsetPos = TileItem.getOffsetByDirection(this._tileItemInfo.size.x, this._tileItemInfo.size.y, this._direction)
        const newPos = Tile.getPosition(offsetPos.x, offsetPos.y)

        newRotationOffset.x = newPos.x
        newRotationOffset.y = newPos.y
     
        this._tileItemRender.setPosition(position.x + newRotationOffset.x, position.y + newRotationOffset.y)

        /*
        if(!this._collisionBox)
        {
            this.createCollisionBox()
        }

        this._collisionBox?.setPosition(
            position.x - (Tile.SIZE.x/2 * (isFlipped ? -1 : 1)),
            position.y - Tile.SIZE.y/2
        )

        this._collisionBox?.setDepth(100 + position.y)

        this._collisionBox?.setAlpha(0.8)

        this._collisionBox?.setScale(isFlipped ? -1 : 1, 1)
        */
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

  
    public rotate()
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
            console.warn("Direction changed")
            this.setDirection(rotateTo)
            
        } else {
            console.error("Cant rotate")
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