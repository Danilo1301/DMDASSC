import GameScene from "@cafemania/game/scene/GameScene";
import Tile from "@cafemania/tile/Tile";
import TileItemInfo, { TileItemRotationType, TileItemType } from "./TileItemInfo";
import TileItemRender from "./TileItemRender";
import {v4 as uuidv4} from 'uuid';

export enum TileItemDirection
{
    FRONT,
    BACK_FLIPPED,
    BACK,
    FRONT_FLIPPED,
}

export default class TileItem
{
    public events = new Phaser.Events.EventEmitter()

    private _tileItemInfo: TileItemInfo

    private _tile!: Tile

    private _id: string

    private _tileItemRender?: TileItemRender

    private _direction: TileItemDirection = TileItemDirection.FRONT

    private _currentAnim: number = 0

    private _debugText?: Phaser.GameObjects.BitmapText
    
    private _isHovering: boolean = false
    
    constructor(tileItemInfo: TileItemInfo)
    {
        this._id = uuidv4()
        this._tileItemInfo = tileItemInfo

        this.events.on("pointerup", () => {
            this.rotate()
        })

        this.events.on("pointerover", () => {
            this._isHovering = true
        })

        this.events.on("pointerout", () => {
            this._isHovering = false
        })
    }

    public setIsTransparent(transparent: boolean)
    {
        return this._tileItemRender?.setTransparent(transparent)
    }

    public getPosition()
    {
        return this.getTile().getCenterPosition()
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

    public setDirection(direction: TileItemDirection)
    {
        this._direction = direction
    }

    public update(delta: number)
    {
        
    }

    public render(): void
    {
        const scene = this.getScene()

        if(!this._tileItemRender)
        {
            const tileItemRender = this._tileItemRender = this.getGame().tileItemFactory.createTileItemRender(this._tileItemInfo.id)
            tileItemRender.setTileItem(this)

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

        this._tileItemRender.render()

        this.renderDebugText()
    }

    private renderDebugText()
    {
        const scene = this.getScene()

        if(this._isHovering)
        {
            if(!this._debugText)
            {
                this._debugText = scene.add.bitmapText(0, 0, 'gem', `TileItem`, 16).setOrigin(0.5);
                this._debugText.setTint(0xffffff)
                this._debugText.setDepth(10000)
            }

            this._debugText.setPosition(this.getTile().position.x, this.getTile().position.y)

            this._debugText.setText(`${JSON.stringify(this.serialize())}`)
        } else {
            if(this._debugText) {
                this._debugText.destroy()
                this._debugText = undefined
            }

        }

        
    }

    public setTile(tile: Tile): void
    {
        this._tile = tile
    }

    protected getGame()
    {
        return this._tile.getWorld().getGame()
    }

    private getScene()
    {
        return GameScene.getScene()
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

        console.log("Direction was " + this.direction)

        while(!canRotate || n < 4)
        {
            if(this._tileItemInfo.rotationType == TileItemRotationType.SIDE_ONLY && rotateTo >= 2)
                rotateTo += 2

            let newDir: TileItemDirection = (rotateTo + n)%4
  
            const canBePlaced = this._tile.getWorld().canTileItemBePlaced(this, this._tile.x, this._tile.y, newDir)

            if(canBePlaced)
            {
                rotateTo = newDir
                canRotate = true
                break
            }

            n++
        }

        if(canRotate)
        {
            this.setDirection(rotateTo)

            console.log("Direction changed to " + this.direction)
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

    public static directionToString(direction: TileItemDirection): string
    {
        switch(direction)
        {
            case TileItemDirection.FRONT: return `FRONT`
            case TileItemDirection.FRONT_FLIPPED: return `FRONT_FLIPPED`
            case TileItemDirection.BACK: return `BACK`
            case TileItemDirection.BACK_FLIPPED: return `BACK_FLIPPED`
        }
    }
}