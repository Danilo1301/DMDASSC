import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { Direction } from "@cafemania/utils/Direction";
import { TileItem } from "./TileItem";
import { TileItemDoor } from "./TileItemDoor";
import { TileItemInfo, TileItemType } from "./TileItemInfo";

export class TileItemWall extends TileItem
{
    private _hasHole: boolean = false
    private _holeCreated: boolean = false

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)
    }

    public getDoorInFront(): TileItemDoor | undefined
    {
        const offset = Tile.getOffsetFromDirection(this.direction)

        const tile = this.getTile().getTileInOffset(offset.x, offset.y)

        if(!tile) return
        if(!tile.hasDoor()) return

        return tile.getDoor()
    }

    public setWallHole(value: boolean): void
    {
        this._hasHole = value
    }

    public render(delta: number): void
    {
        super.render(delta)

        this.renderWallHole()
    }

    public updateSprites()
    {
        super.updateSprites()

        this._hasHole = this.getDoorInFront() != undefined
    }

    private renderWallHole(): void
    {
        const tileItemRender = this.getTileItemRender()
        const scene = GameScene.Instance

        if(!tileItemRender) return

        const wallHoleKey = `${this.getInfo().name}_hole`

        if(!scene.textures.exists(wallHoleKey))
        {
            const sprite = this.getSpriteWithImage()
            const image = sprite.image!

            const canvas = image.texture.getSourceImage() as HTMLCanvasElement 
            const wallHoleCanvas = scene.textures.createCanvas(wallHoleKey, canvas.width, canvas.height)

            const imageData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
            const wallMask = scene.textures.get('wallMask').getSourceImage() as HTMLImageElement 

            wallHoleCanvas.putData(imageData, 0, 0)
            wallHoleCanvas.context.globalCompositeOperation="destination-out";
            wallHoleCanvas.context.drawImage(wallMask, 0, wallHoleCanvas.height - wallMask.height)
            wallHoleCanvas.refresh()
        }
      
        if(this._hasHole)
        {
            if(!this._holeCreated)
            {
                this._holeCreated = true

                const sprite = this.getSpriteWithImage()
                const image = sprite.image!

                image.destroy()
                sprite.image = scene.add.image(0, 0, wallHoleKey)

                this.setTileItemRenderSpritesToLayers()
                this.updateSprites()
            }
        }
    }

    private getSpriteWithImage()
    {
        const sprites = this.getTileItemRender()!.getSprites().filter(sprite => sprite.image != undefined)
        return sprites[0]
    }
}