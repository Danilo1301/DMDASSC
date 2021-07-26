import GameScene from "@cafemania/game/scene/GameScene"
import Tile from "@cafemania/world/tile/Tile"
import { text } from "express"
import TileCollisionFactory from "./TileCollisionFactory"
import TileItem from "./TileItem"
import TileItemInfo from "./TileItemInfo"
import TileTextureFactory from "./TileTextureFactory"

interface TileItemRenderSprite
{
    spriteLayer: number
    x: number
    y: number
    container: Phaser.GameObjects.Container
    sprite: Phaser.GameObjects.Sprite
}

export default class TileItemRender
{
    public depth: number = 0

    //private _sprites: {[coord: string]: Phaser.GameObjects.Sprite} = {}
    //private _containers: {[coord: string]: Phaser.GameObjects.Container} = {}

    private _currentSprite: number = 0
    private _currentLayer: number = 0

    private _tileItemInfo: TileItemInfo

    private _flipSprites: boolean = false
    private _transparent: boolean = false

    private _position: Phaser.Math.Vector2

    private _sprites: {[extraLayer: string]: {[coord: string]: TileItemRenderSprite}} = {}

    public tileItem?: TileItem

    constructor(scene: GameScene, tileItemInfo: TileItemInfo)
    {
        this._position = new Phaser.Math.Vector2(0, 0)

        this._tileItemInfo = tileItemInfo

        const textureName = tileItemInfo.texture
        const size = tileItemInfo.size
        const sprites = tileItemInfo.sprites
        const layers = tileItemInfo.layers
        const extraLayers = tileItemInfo.extraLayers

        const textureKeys = TileTextureFactory.generateTextures(textureName, size, sprites, layers * extraLayers);

        const gridBounds = Tile.getGridBounds(size.x, size.y)

        for (let spriteLayer = 0; spriteLayer < tileItemInfo.extraLayers; spriteLayer++)
        {
            if(!this._sprites[spriteLayer]) this._sprites[spriteLayer] = {}

            for (let y = 0; y < size.y; y++)
            {
                for (let x = 0; x < size.x; x++)
                {
                    const key = `${x}_${y}`
                    const textureKey = textureKeys[key]

                    if(!textureKey) continue

                    const pos = Tile.getPosition(x, y)

                    const tileItemRenderSprite: TileItemRenderSprite =  this._sprites[spriteLayer][key] = {
                        x: x,
                        y: y,
                        spriteLayer: spriteLayer,
                        container: scene.add.container(),
                        sprite: scene.add.sprite(0, 0, textureKey, '0_0')
                    }

                    
                    //console.log(tileItemInfo.texture, x, y, spriteLayer)

                    tileItemRenderSprite.sprite.setOrigin(0.5, 1)
                    tileItemRenderSprite.sprite.setPosition(
                        0,
                        -pos.y + (gridBounds.bottom + gridBounds.height) + 1
                    )

                    tileItemRenderSprite.container.add(tileItemRenderSprite.sprite)

                    scene.objectsLayer!.add(tileItemRenderSprite.container)


                    //collision
                    if(spriteLayer == 0)
                    {
                        const color = 0xff0000
                        const alpha = 0.2

                        let points: Phaser.Math.Vector2[] = []
                        
                        const offsetX = [0, 0]
                        const offsetY = [0, 0]

                        if(y == 0) offsetX[0] = tileItemInfo.collision.x
                        if(y == tileItemInfo.size.y-1) offsetX[1] = tileItemInfo.collision.x

                        if(x == 0) offsetY[0] = tileItemInfo.collision.y
                        if(x == tileItemInfo.size.x-1) offsetY[1] = tileItemInfo.collision.y

                        if(tileItemInfo.collision.isWall)
                        {
                            offsetY[0] -= tileItemInfo.collision.height
                            offsetY[1] += tileItemInfo.collision.height

                            points = TileCollisionFactory.getWallCollisionPoints(false,
                                offsetX,
                                offsetY,
                                tileItemInfo.collision.wallSize
                            )
                        } else {
                            points = TileCollisionFactory.getBlockCollisionPoints(
                                offsetX,
                                offsetY,
                                tileItemInfo.collision.height
                            )
                        }

                    

                        const collisionBox = scene.add.polygon(0, 0, points, color, alpha)
                        collisionBox.setOrigin(0, 0)


                        tileItemRenderSprite.container.add(collisionBox)

                        collisionBox.setPosition(
                            - Tile.SIZE.x/2, - Tile.SIZE.y/2
                        )

                        const self = this

                        collisionBox.setInteractive(
                            new Phaser.Geom.Polygon(points),
                            Phaser.Geom.Polygon.Contains
                        );

                        collisionBox.on('pointerdown', function (pointer) {
                            console.log(self._tileItemInfo.name);

                            if(self.tileItem) self.tileItem.rotate()
                        });

                        collisionBox.on('pointerover', function (pointer) {
                            collisionBox.setFillStyle(0x000000, 0.5)
                        });

                        collisionBox.on('pointerout', function (pointer) {
                            collisionBox.setFillStyle(color, alpha)
                        });

                    }
                }
            }
        }

        //console.log(this._sprites)

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
        for (const spriteLayerKey in this._sprites) {
            const spriteLayer = this._sprites[spriteLayerKey]

            for (const coord in spriteLayer) {
                const tileItemRenderSprite = spriteLayer[coord]

                const pos = Tile.getPosition(tileItemRenderSprite.x, tileItemRenderSprite.y)

                const container = tileItemRenderSprite.container
                container.setPosition(
                    this._position.x + ((this._flipSprites ? -1 : 1) * pos.x),
                    this._position.y + (pos.y)
                )
                container.setScale(this._flipSprites ? -1 : 1, 1)
                container.setDepth(container.y - this.depth - (tileItemRenderSprite.spriteLayer * 5))
    
                const sprite = tileItemRenderSprite.sprite

                const frame = {
                    layer: this._currentLayer + (tileItemRenderSprite.spriteLayer * this._tileItemInfo.extraLayers),
                    sprite: this._currentSprite
                }

                sprite.setFrame(`${frame.layer}_${frame.sprite}`)
                sprite.setAlpha(this._transparent ? 0.3 : 1)
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