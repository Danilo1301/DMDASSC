import { Grid } from "@cafemania/grid/Grid";
import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileTextureGenerator } from "@cafemania/tile/TileTextureGenerator";
import { TileItem, TileItemDirection } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

interface Sprite
{
    image: Phaser.GameObjects.Image
    x: number
    y: number
    extraLayer: number
}

export class TileItemRender
{
    public static valuesFromDirection(direction: TileItemDirection): boolean[]
    {
        return [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
        ][direction]
    }

    private _tileItemInfo: TileItemInfo

    private _sprites: {[extraLayer: string]: {[coord: string]: Sprite}} = {}

    private _changeRotation: boolean = false

    private _flipCells: boolean = false

    private _position = new Phaser.Math.Vector2()

    private _layerX: number = 0
    
    private _layerY: number = 0

    private _tileItem?: TileItem

    constructor(tileItemInfo: TileItemInfo)
    {
        this._tileItemInfo = tileItemInfo

        this.createSprites()
        //this.testLayers()
    }

    private getInfo(): TileItemInfo
    {
        return this._tileItemInfo
    }

    private getTileItem(): TileItem | undefined
    {
        return this._tileItem
    }

    public setTileItem(tileItem: TileItem): void
    {
        this._tileItem = tileItem
    }

    public setPosition(position: Phaser.Math.Vector2): void
    {
        this._position = position

        this.updateSprites()
    }

    public setRotation(changeRotation: boolean, flipCells: boolean): void
    {
        this._changeRotation = changeRotation
        this._flipCells = flipCells

        this.updateSprites()

        //console.log("TileItemRender.setRotation")
    }

    public setLayer(layerX: number, layerY: number): void
    {
        const layers = this.getInfo().layers

        if(layerX >= layers.x || layerY >= layers.y) return

        this._layerX = layerX
        this._layerY = layerY

        this.updateSprites()
    }

    public getSprites(): Sprite[]
    {
        const sprites: Sprite[] = []

        for (const extraLayer in this._sprites)
        {
            for (const key in this._sprites[extraLayer])
            {
                const sprite = this._sprites[extraLayer][key]

                sprites.push(sprite)
            }
        }

        return sprites
    }

    private createSprites(): void
    {
        const tileItemInfo = this.getInfo()
        const scene = GameScene.Instance

        const sheetTextureKey = `${tileItemInfo.name}_sheet`

        if(!scene.textures.exists(sheetTextureKey))
        {
            TileTextureGenerator.create(
                scene,
                tileItemInfo.texture,
                sheetTextureKey,
                tileItemInfo.originPosition,
                tileItemInfo.size,
                new Phaser.Math.Vector2(tileItemInfo.layers.x, tileItemInfo.layers.y)
            )
        }

        const texture = scene.textures.get(sheetTextureKey)
        const size = tileItemInfo.size

        for (let extraLayer = 0; extraLayer <= tileItemInfo.extraLayers; extraLayer++)
        {
            this._sprites[extraLayer] = {}

            for (let y = 0; y < size.y; y++)
            {
                for (let x = 0; x < size.x; x++)
                {
                    const key = `${this._layerX}:${this._layerY}:${x}:${y}`

                    if(!texture.has(key)) continue

                    const image = scene.add.image(0, 0, texture.key)
                    //image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR)
                    image.setOrigin(0, 1)

                    image.setFrame(key)

                    //image.setAlpha(1)
                    image.setDepth(10)

                    const sprite: Sprite = {
                        image: image,
                        x: x,
                        y: y,
                        extraLayer: extraLayer
                    }

                    this._sprites[extraLayer][key] = sprite
                }
            }
        }

        this.updateSprites()
    }

    private testLayers(): void
    {
        let x = 0
        let y = 0

        setInterval(() =>
        {
            this.setLayer(x, y)

            x++
            if(x >= this.getInfo().layers.x)
            {
                x = 0
                y++

                if(y >= this.getInfo().layers.y / (this.getInfo().extraLayers+1)) y = 0
            }
        }, 1000)
    }

    private updateSprites(): void
    {
        const changeRotation = this._changeRotation
        const flipCells = this._flipCells

        const coords = Grid.getOffsetCoordsItemOcuppes(this._tileItemInfo.size, changeRotation, flipCells)
        const sprites = this.getSprites()

        for (const sprite of sprites)
        {
            const x = sprite.x
            const y = sprite.y
            const key = `${x}:${y}`

            sprite.image.setPosition(0, -500)
            
            let cs = coords.filter(c => {
                return c[0].x == (!changeRotation ? x : y) && c[0].y == (!changeRotation ? y : x)
            })

            if(!cs[0])
            {
                console.log(key, `wot`)
                continue
            }

            let newCoord = cs[0][1]

            const position = Tile.getTilePosition(newCoord.x, newCoord.y)

            position.y += Tile.SIZE.y

            position.x += this._position.x
            position.y += this._position.y

            const tileItemInfo = this.getInfo()
            const framesPerLayer = tileItemInfo.layers.y / (tileItemInfo.extraLayers+1)
            const layerY = this._layerY + (framesPerLayer * sprite.extraLayer)

            
            sprite.image.setPosition(position.x - Math.ceil(Tile.SIZE.x/2), position.y - Math.ceil(Tile.SIZE.y/2))
            //sprite.image.setPosition(position.x, position.y)
            sprite.image.setScale(!changeRotation ? 1 : -1, 1)
            sprite.image.setOrigin(!changeRotation ? 0 : 1, 1)

            const frameKey = `${this._layerX}:${layerY}:${sprite.x}:${sprite.y}`;

            if(sprite.image.texture.has(frameKey)) sprite.image.setFrame(frameKey)

            sprite.image.setDepth(this._position.y + (sprite.extraLayer*5))
        }
    }
}