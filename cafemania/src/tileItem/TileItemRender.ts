import Tile from "@cafemania/world/tile/Tile"
import { text } from "express"
import TileItemInfo from "./TileItemInfo"
import TileTextureFactory from "./TileTextureFactory"

export default class TileItemRender
{
    public depth: number = 0

    private _sprites: {[coord: string]: Phaser.GameObjects.Sprite} = {}
    private _containers: {[coord: string]: Phaser.GameObjects.Container} = {}

    private _currentSprite: number = 0
    private _currentLayer: number = 0

    private _tileItemInfo: TileItemInfo

    private _flipSprites: boolean = false
    private _transparent: boolean = false

    private _position: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, tileItemInfo: TileItemInfo)
    {
        this._position = new Phaser.Math.Vector2(0, 0)

        this._tileItemInfo = tileItemInfo

        const textureName = tileItemInfo.texture
        const size = tileItemInfo.size
        const sprites = tileItemInfo.sprites
        const layers = tileItemInfo.layers

        const textureKeys = TileTextureFactory.generateTextures(textureName, size, sprites, layers);

        const gridBounds = Tile.getGridBounds(size.x, size.y)

        for (let y = 0; y < size.y; y++)
        {
            for (let x = 0; x < size.x; x++)
            {
                const key = `${x}_${y}`
                const textureKey = textureKeys[key]

                if(!textureKey) continue

                const pos = Tile.getPosition(x, y)

                const container = this._containers[key] = scene.add.container()
                
                const sprite = this._sprites[key] = scene.add.sprite(0, 0, textureKey, '0_0')
                sprite.setOrigin(0.5, 1)
                sprite.setPosition(
                    0,
                    -pos.y + (gridBounds.bottom + gridBounds.height)
                )

                container.add(sprite)
            }
        }

        

        console.log(this._sprites)
    }

    public setSprite(sprite: number) {
        this._currentSprite = sprite
        this.updateSprites()
    }

    public setLayer(layer: number) {
        this._currentLayer = layer
        this.updateSprites()
    }

    public updateSprites()
    {
        for (let y = 0; y < this._tileItemInfo.size.y; y++)
        {
            for (let x = 0; x < this._tileItemInfo.size.x; x++)
            {
                const key = `${x}_${y}`

                const pos = Tile.getPosition(x, y)

                const container = this._containers[key]

                if(container)
                {
                    container.setPosition(
                        this._position.x + ((this._flipSprites ? -1 : 1) * pos.x),
                        this._position.y + (pos.y)
                    )
                    container.setScale(this._flipSprites ? -1 : 1, 1)
                    container.setDepth(container.y - this.depth)
                }

                const sprite = this._sprites[key]

                if(sprite)
                {
                    sprite.setFrame(`${this._currentLayer}_${this._currentSprite}`)
                    sprite.setAlpha(this._transparent ? 0.3 : 1)
                }
            }
        }
    }

    public setPosition(x: number, y: number)
    {
        this._position.set(x, y)

        this.updateSprites()
    }
    
    public setFlipSprites(value: boolean)
    {
        this._flipSprites = value

        this.updateSprites()
    }

    public setTransparent(value: boolean)
    {
        this._transparent = value

        this.updateSprites()
    }
}