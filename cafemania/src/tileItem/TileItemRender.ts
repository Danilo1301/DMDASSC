import GameScene from "@cafemania/game/scene/GameScene"
import Tile from "@cafemania/tile/Tile"
import TileCollisionFactory from "./TileCollisionFactory"
import TileItem from "./TileItem"
import TileItemInfo, { TileItemType } from "./TileItemInfo"
import TileTextureFactory from "./TileTextureFactory"

interface TileItemRenderSprite
{
    spriteLayer: number
    x: number
    y: number
    container: Phaser.GameObjects.Container
    sprite?: Phaser.GameObjects.Sprite
    collision?: Phaser.GameObjects.Polygon
}

export default class TileItemRender
{
    public depth: number = 0

    private _tileItem?: TileItem

    private _currentSprite: number = 0
    private _currentLayer: number = 0

    private _tileItemInfo: TileItemInfo

    private _flipSprites: boolean = false
    private _transparent: boolean = false

    private _position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

    private _sprites: {[extraLayer: string]: {[coord: string]: TileItemRenderSprite}} = {}

    private _debugText?: Phaser.GameObjects.BitmapText

    constructor(tileItemInfo: TileItemInfo)
    {
        this._tileItemInfo = tileItemInfo

        this.createSprites()
    }

    private createSprites()
    {
        const tileItemInfo = this._tileItemInfo

        const canCreateCollision = tileItemInfo.type != TileItemType.FLOOR && tileItemInfo.type != TileItemType.WALL

        const scene = this.getScene()
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

                    const pos = Tile.getPosition(x, y)

                    const tileItemRenderSprite: TileItemRenderSprite = this._sprites[spriteLayer][key] = {
                        x: x,
                        y: y,
                        spriteLayer: spriteLayer,
                        container: scene.add.container()
                    }
                    
                    if(textureKey)
                    {
                        tileItemRenderSprite.sprite = scene.add.sprite(0, 0, textureKey, '0_0')
     
                        tileItemRenderSprite.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)

                        tileItemRenderSprite.sprite.setOrigin(0.5, 1)
                        tileItemRenderSprite.sprite.setPosition(
                            0,
                            -pos.y + (gridBounds.bottom + gridBounds.height) + 1
                        )

                        tileItemRenderSprite.container.add(tileItemRenderSprite.sprite)
                    }

                    scene.objectsLayer!.add(tileItemRenderSprite.container)

                    if(spriteLayer == 0 && canCreateCollision)
                    {
                        this.createSpriteCollision(tileItemRenderSprite)
                    }
                }
            }
        }

        //console.log(this._sprites)

        /*
        const text = this._debugText = this.getScene().add.bitmapText(0, 0, 'gem', `aoba`, 16).setOrigin(0.5);
        text.setTintFill(0x000000)
        text.setDepth(10000)
        */
    }

    public render()
    {
        this.updateSprites()

        //console.log(this._sprites)
    }

    public setTileItem(tileItem: TileItem): void
    {
        this._tileItem = tileItem
    }

    public hasTileItem(): boolean
    {
        return this._tileItem != undefined
    }

    public getTileItem(): TileItem
    {
        return this._tileItem!
    }

    public setSceneLayer(layer: Phaser.GameObjects.Layer): void
    {
        this.getAllSprites().map(sprite => {
            layer.add( sprite.container )

            if(sprite.collision) layer.add( sprite.collision )
        })
   
    }

    private getAllSprites(): TileItemRenderSprite[]
    {
        const sprites: TileItemRenderSprite[] = []

        for (const spriteLayerKey in this._sprites)
        {
            const spriteLayer = this._sprites[spriteLayerKey]

            for (const coord in spriteLayer)
            {
                const tileItemRenderSprite = spriteLayer[coord]

                sprites.push(tileItemRenderSprite)
            }
        }

        return sprites
    }

    private getScene()
    {
        return GameScene.getScene()
    }

    private createSpriteCollision(sprite: TileItemRenderSprite)
    {
        const tileItemInfo = this._tileItemInfo
        const x = sprite.x
        const y = sprite.y
        const scene = this.getScene()

        const color = 0xff0000
        const alpha = 0

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

            const atFront = tileItemInfo.collision.wallAtFront === true

            points = TileCollisionFactory.getWallCollisionPoints(atFront,
                offsetX,
                offsetY,
                tileItemInfo.collision.wallSize || 0
            )
        } else {
            points = TileCollisionFactory.getBlockCollisionPoints(
                offsetX,
                offsetY,
                tileItemInfo.collision.height
            )
        }

        const collisionBox = sprite.collision = scene.add.polygon(0, 0, points, color, alpha)
        collisionBox.setOrigin(0, 0)

        //sprite.container.add(collisionBox)

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

            if(self._tileItem) self._tileItem.rotate()
        });

        collisionBox.on('pointerover', function (pointer) {
            collisionBox.setFillStyle(0xff0000, 0.3)

            if(self._tileItem) self._tileItem.isHovering = true
        });

        collisionBox.on('pointerout', function (pointer) {
            collisionBox.setFillStyle(color, alpha)

            if(self._tileItem) self._tileItem.isHovering = false

        });
    }

    public setSprite(sprite: number) {
        this._currentSprite = sprite
    }

    public setLayer(layer: number) {
        this._currentLayer = layer
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

                const depth = (container.y - ((this._flipSprites ? -1 : 1)*(this._tileItem?.getTile().y || 0))) - this.depth - (tileItemRenderSprite.spriteLayer * 5)

                container.setDepth(depth)

                
                
                const sprite = tileItemRenderSprite.sprite

                if(sprite)
                {
                    const frame = {
                        layer: this._currentLayer + (tileItemRenderSprite.spriteLayer * this._tileItemInfo.extraLayers),
                        sprite: this._currentSprite
                    }
    
                    
                    sprite.setFrame(`${frame.layer}_${frame.sprite}`)
                    sprite.setAlpha(this._transparent ? 0.3 : 1)
                    
                }


                if(tileItemRenderSprite.collision)
                {

            
                    tileItemRenderSprite.collision.setPosition(
                        container.x - ((this._flipSprites ? -1 : 1) * Tile.SIZE.x/2),
                        container.y - (Tile.SIZE.y/2)
                    )

        
                    tileItemRenderSprite.collision.setDepth(depth + 100)
                    tileItemRenderSprite.collision.setScale(container.scaleX, container.scaleY)

                }
                
            }

        }

        if(this._tileItem && this._debugText)
        {
            const pos = this._tileItem.getTile().position

            this._debugText.setAlpha(1)
            this._debugText.setPosition(pos.x, pos.y)
            this._debugText.setText(`${this._tileItemInfo.name}\n${TileItem.directionToString(this.getTileItem().direction)}`)

            if(this._tileItem.isHovering)
            {
                const pos = this._tileItem.getTile().position

                
                
            } else {
                
            }
        }

        

        
    }

    public setPosition(x: number, y: number)
    {
        this._position.set(x, y)
    }
    
    public setFlipSprites(value: boolean)
    {
        this._flipSprites = value
    }

    public setTransparent(value: boolean)
    {
        this._transparent = value
    }
}