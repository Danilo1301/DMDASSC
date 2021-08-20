import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { TileItem, TileItemDirection } from "./TileItem";
import { TileItemInfo, TileItemType } from "./TileItemInfo";

export class TileItemWall extends TileItem
{
    private _wallMask?: Phaser.GameObjects.Graphics

    private _hasHole: boolean = false

    private _holeCreated: boolean = false

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
        this._hasHole = value
    }

    private getWallHoleKey()
    {
        return `${this.getInfo().name}_hole`
    }

    public render(delta: number)
    {
        super.render(delta)

        const tileItemInfo = this.getInfo()
        const tileItemRender = this.getTileItemRender()
        const scene = GameScene.Instance

        if(!tileItemRender) return

        if(tileItemInfo.type == TileItemType.WALL)
        {

            
            const wallHoleKey = this.getWallHoleKey()

            if(!scene.textures.exists(wallHoleKey))
            {
                const canvas = tileItemRender.getSprites()[0].image.texture.getSourceImage() as HTMLCanvasElement 
                const wallHoleCanvas = scene.textures.createCanvas(wallHoleKey, canvas.width, canvas.height)

                wallHoleCanvas.context.fillStyle = "red"
                wallHoleCanvas.context.fillRect(0, 0, canvas.width, canvas.height)

                const imageData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)

                wallHoleCanvas.putData(imageData, 0, 0)

                const wallMask = scene.textures.get('wallMask').getSourceImage() as HTMLImageElement 

                wallHoleCanvas.context.globalCompositeOperation="destination-out";


                wallHoleCanvas.context.drawImage(wallMask, 0, wallHoleCanvas.height - wallMask.height)

                wallHoleCanvas.refresh()

                console.log(wallHoleCanvas)
            }

            
        }

        if(this._hasHole)
        {
            if(!this._holeCreated)
            {
                this._holeCreated = true

                tileItemRender.getSprites()[0].image.destroy()

                const wallHoleKey = this.getWallHoleKey()

                tileItemRender.getSprites()[0].image = scene.add.image(0, 0, wallHoleKey)

                this.setTileItemRenderSpritesToLayers()
                this.updateSprites()

                console.log("yes")
            }
        }

        //this.renderWallMask()
    }

    private renderWallMask()
    {
        /*
        const tileItemRender = this.getTileItemRender()

        if(!tileItemRender) return

        const scene = GameScene.Instance

        if(!this._canCreateWallMask && this._wallMask)
        {
            this._wallMask.destroy()
            this._wallMask = undefined
        }

        return

        if(!this._canCreateWallMask) return

        
        if(!this._wallMask)
        {
            const points = TileCollisionFactory.getWallCollisionPoints(true, [0, 0], [70, 0], 0)

            const graphics = this._wallMask = scene.add.graphics()
            graphics.fillStyle(0x000000)
            graphics.fillPoints(points)

            const mask = graphics.createGeometryMask()
            mask.setInvertAlpha()

            //const sprites = tileItemRender.getSprites()
            //sprites.map(sprite => sprite.image.setMask(mask))

            this.updateWallMask() 
        }
        */
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

        console.log("update mask")
    }
}