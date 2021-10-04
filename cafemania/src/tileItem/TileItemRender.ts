import { Grid } from "@cafemania/grid/Grid";
import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { TileTextureGenerator } from "@cafemania/tile/TileTextureGenerator";
import { Direction } from "@cafemania/utils/Direction";
import { TileItem } from "./TileItem";
import { TileItemInfo, TileItemPlaceType, TileItemType } from "./TileItemInfo";

interface Sprite
{
    x: number
    y: number
    extraLayer: number
    image?: Phaser.GameObjects.Image
    collision?: Phaser.GameObjects.Polygon
}

export class TileItemRender
{
    public static valuesFromDirection(direction: Direction): boolean[]
    {
        return [
            [false, true],
            [false, false],
            [true, false],
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

    private _depth: number = 0

    constructor(tileItemInfo: TileItemInfo, tileItem?: TileItem)
    {
        this._tileItemInfo = tileItemInfo
        this._tileItem = tileItem

        this.createSprites()
        //this.testLayers()
    }

    public setDepth(value: number)
    {
        this._depth = value
    }

    private getInfo(): TileItemInfo
    {
        return this._tileItemInfo
    }

    private getTileItem(): TileItem | undefined
    {
        return this._tileItem
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

                    const sprite: Sprite = {
                        x: x,
                        y: y,
                        extraLayer: extraLayer
                    }

                    if(texture.has(key))
                    {
                        const image = sprite.image = scene.add.image(0, 0, texture.key)
                        image.setOrigin(0, 1)
                        image.setFrame(key)
                        //image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR)
                    }


                    //change
                    const canCreateCol = this._tileItemInfo.type == TileItemType.WALL_DECORATION || this._tileItemInfo.type == TileItemType.STOVE || this._tileItemInfo.type == TileItemType.DOOR || this._tileItemInfo.type == TileItemType.COUNTER

                    if(extraLayer == 0 && canCreateCol) this.createCollisionForSprite(sprite)

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

    private createCollisionForSprite(sprite: Sprite)
    {
        const tileItemInfo = this._tileItemInfo
        const x = sprite.x
        const y = sprite.y
        const scene = GameScene.Instance

        const size = tileItemInfo.size
        const offsetX = [0, 0]
        const offsetY = [0, 0]
        
        if(x == 0) offsetX[0] = tileItemInfo.collision.x
        if(x == size.x-1) offsetX[1] = tileItemInfo.collision.x

        if(y == 0) offsetY[0] = tileItemInfo.collision.y
        if(y == size.y-1) offsetY[1] = tileItemInfo.collision.y

        let points: Phaser.Math.Vector2[] = []

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
        }
        else
        {
            points = TileCollisionFactory.getBlockCollisionPoints(
                offsetX,
                offsetY,
                tileItemInfo.collision.height
            )
        }

        const collisionBox = sprite.collision = scene.add.polygon(0, 0, points, 0, 0)
        collisionBox.setOrigin(0, 0)

        collisionBox.setInteractive(
            new Phaser.Geom.Polygon(points),
            Phaser.Geom.Polygon.Contains
        )

        this.setupCollision(collisionBox)
    }

    private setupCollision(collision: Phaser.GameObjects.Polygon)
    {
        const color = 0xff0000
        const alphaHover = 0.5
        const alpha = 0

        collision.setFillStyle(color, alpha)

        const self = this

        collision.on('pointerup', function (pointer) {
            self._tileItem?.events.emit?.("pointerup")
        });

        collision.on('pointerdown', function (pointer) {
            self._tileItem?.events.emit?.("pointerdown")
        });

        collision.on('pointerover', function (pointer) {
            collision.setFillStyle(color, alphaHover)
            self._tileItem?.events.emit?.("pointerover")
        });

        collision.on('pointerout', function (pointer) {
            collision.setFillStyle(color, alpha)
            self._tileItem?.events.emit?.("pointerout")
        });
    }

    public updateSprites(): void
    {
        const changeRotation = this._changeRotation
        const flipCells = this._flipCells

        const coords = Grid.getOffsetCoordsItemOcuppes(this._tileItemInfo.size, changeRotation, flipCells)
        const sprites = this.getSprites()


        for (const sprite of sprites)
        {
          
            const x = sprite.x
            const y = sprite.y
            //const key = `${x}:${y}`

            let cs = coords.filter(c => {
                return c[0].x == (!changeRotation ? x : y) && c[0].y == (!changeRotation ? y : x)
            })

            let newCoord = cs[0][1]

            
            const position = Tile.getTilePosition(newCoord.x, newCoord.y)

            position.x += this._position.x
            position.y += this._position.y

       
            const tileItemInfo = this.getInfo()
            const framesPerLayer = tileItemInfo.layers.y / (tileItemInfo.extraLayers+1)
            const layerY = this._layerY + (framesPerLayer * sprite.extraLayer)
            const frameKey = `${this._layerX}:${layerY}:${sprite.x}:${sprite.y}`;
            const depth = (position.y) + (sprite.extraLayer*5) + this._depth

            const image = sprite.image
            if(image)
            {
                
                //console.log(sprite)
                
                image.setPosition(
                    position.x - Math.ceil(Tile.SIZE.x/2),
                    position.y - Math.ceil(Tile.SIZE.y/2) + Tile.SIZE.y
                )
                image.setScale(!changeRotation ? 1 : -1, 1)
                image.setOrigin(!changeRotation ? 0 : 1, 1)
                image.setDepth(depth)
                

                if(image.texture.has(frameKey)) image.setFrame(frameKey)
            }

            const collision = sprite.collision
            if(collision)
            {


                //collision.setPosition(position.x - Math.ceil(Tile.SIZE.x/2), position.y - Math.ceil(Tile.SIZE.y/2) - Tile.SIZE.y)
                const add = new Phaser.Math.Vector2(
                    -Math.ceil(Tile.SIZE.x/2) - Tile.SIZE.x,
                    -Math.ceil(Tile.SIZE.y/2)
                )

                const collisionPos = new Phaser.Math.Vector2(
                    position.x - Math.ceil(Tile.SIZE.x/2),
                    position.y - Math.ceil(Tile.SIZE.y/2)
                )

                if(changeRotation) collisionPos.x += Tile.SIZE.x

                collision.setPosition(
                    collisionPos.x,
                    collisionPos.y
                )

                collision.setScale(!changeRotation ? 1 : -1, 1)
                collision.setDepth(depth + 1000)
            }
        }
    }
}

/*


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

sprite.image.setDepth((position.y - Tile.SIZE.y) + (sprite.extraLayer*5) + this._depth)

*/