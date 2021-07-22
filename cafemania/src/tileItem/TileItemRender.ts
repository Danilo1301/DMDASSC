import Tile from "@cafemania/world/tile/Tile"
import { text } from "express"
import TileItemInfo from "./TileItemInfo"
import TileTextureFactory from "./TileTextureFactory"

export default class TileItemRender
{
    private _container: Phaser.GameObjects.Container

    private _sprites: {[coord: string]: Phaser.GameObjects.Sprite} = {}

    private _currentSprite: number = 0
    private _currentLayer: number = 0

    constructor(scene: Phaser.Scene, tileItemInfo: TileItemInfo)
    {
        const textureName = tileItemInfo.texture
        const size = tileItemInfo.size
        const sprites = tileItemInfo.sprites
        const layers = tileItemInfo.layers

        this._container = scene.add.container()

        const textureKeys = TileTextureFactory.generateTextures(textureName, size, sprites, layers);

        const testDirection = 1
        const gridBounds = Tile.getGridBounds(size.x, size.y)

        for (let y = 0; y < size.y; y++)
        {
            for (let x = 0; x < size.x; x++)
            {
                const key = `${x}_${y}`
                const textureKey = textureKeys[key]

                if(!textureKey) continue

                const pos = Tile.getPosition(x, y)

                const sprite = this._sprites[key] = scene.add.sprite(0, 0, textureKey, '0_0')
                sprite.setOrigin(0.5, 1)
                sprite.setAlpha(1)

                sprite.setPosition(
                    testDirection * pos.x,
                    gridBounds.height + gridBounds.bottom + 1
                );

                console.log(x, y, textureKeys[`${x}_${y}`])

                this._container.add(sprite)
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
        for (const k in this._sprites)
        {
            this._sprites[k].setFrame(`${this._currentSprite}_${this._currentLayer}`)
        }
    }

    public setPosition(x: number, y: number)
    {
        this._container.setPosition(x, y)
    }
    
    public setDirection(dir: number)
    {
        this._container.setScale(dir, 1)
    }

    public setIsTransparent(transparent: boolean)
    {
        this._container.setAlpha(transparent ? 0.3 : 1)
    }
}