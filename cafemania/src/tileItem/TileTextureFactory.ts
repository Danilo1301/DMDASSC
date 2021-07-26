import GameClient from "@cafemania/game/GameClient"
import Tile from "@cafemania/tile/Tile"

export default class TileTextureFactory
{
    private static _game: GameClient
    private static _scene: Phaser.Scene
    private static _canvas: Phaser.Textures.CanvasTexture
    private static _textureSheetCache: {[tileId: string]: {[coord: string]: string}} = {}
    private static sprites = 1
    private static layers = 1
    private static sizeX = 1
    private static sizeY = 1
    private static texture: Phaser.Textures.Texture

    public static init(game: GameClient, scene: Phaser.Scene): void
    {
        this._game = game
        this._scene = scene

        this.setupCanvas()
    }

    public static getTextures(textureName: string)
    {
        return this._textureSheetCache[textureName]
    }

    public static generateTextures(textureName: string, size: Phaser.Math.Vector2, sprites: number, layers: number)
    {
        if(this._textureSheetCache[textureName] != undefined) return this.getTextures(textureName)

        this.sizeX = size.x
        this.sizeY = size.y
        this.sprites = sprites
        this.layers = layers
        this.texture = this._scene.textures.get(textureName)

        const image = this.getImage()

        this.setCanvasImage(image)

        this._textureSheetCache[textureName] = {};

        const sizeX = this.sizeX
        const sizeY = this.sizeY
        const rectSize = this.getRectSize()

        for (let y = 0; y < sizeY; y++)
        {
            for (let x = 0; x < sizeX; x++)
            {
                if(sizeX != 1 && sizeY != 1)
                {
                    if(y == sizeY-1 && x == 0) continue
                    if(x != 0 && y != sizeY-1) continue
                }

                const pos = Tile.getPosition(x, y)

                //console.log('>', x, y)
                
                const coord = `${x}_${y}`

                const storeToCacheName = `${textureName}_${coord}`
                const textureCanvas = this._scene.textures.createCanvas(storeToCacheName, sprites * Tile.SIZE.x, layers * rectSize.y)
                
                this._textureSheetCache[textureName][coord] = storeToCacheName

                //console.log(`Created texture '${storeToCacheName} for tile '${textureName}' coord (${x}, ${y})'`)

                textureCanvas.context.fillStyle = "black"
                textureCanvas.context.fillRect(0, 0, textureCanvas.width, textureCanvas.height)

                for (let layer = 0; layer < this.layers; layer++)
                {
                    for (let sprite = 0; sprite < this.sprites; sprite++)
                    {
                        const offsetX = (sprite * rectSize.x) + sprite
                        const offsetY = (layer * rectSize.y) + layer

                        const rect = {
                            x: pos.x + offsetX,
                            y: offsetY,
                            w: Tile.SIZE.x,
                            h: rectSize.y
                        }
        
                        const imageData = this._canvas.context.getImageData(rect.x, rect.y, rect.w, rect.h)   

                        textureCanvas.context.putImageData(imageData, sprite * rect.w, layer * rect.h);
        
                        this._canvas.context.clearRect(rect.x, rect.y, rect.w, rect.h)
        
                        textureCanvas.refresh()

                        const frameName = `${layer}_${sprite}`

                        textureCanvas.add(frameName, 0, sprite * rect.w, layer * rect.h, rect.w, rect.h)

                        //console.log('added frame', frameName)

                        this._canvas.refresh()

                    }
                }
            }
        }

        return this.getTextures(textureName)
    }

    private static setupCanvas()
    {
        this._canvas = this._scene.textures.createCanvas('TileTextureFactory_Canvas', 100, 100)
    }

    private static setCanvasImage(image: HTMLImageElement)
    {
        const canvas = this._canvas.setSize(image.width, image.height)
        const ctx = canvas.context;

        ctx.clearRect(0, 0, image.width, image.height)
        ctx.drawImage(image, 0, 0)

        canvas.refresh()
    }

    private static getImage()
    {
        return this.texture.source[0].image as HTMLImageElement 
    }

    public static getRectSize()
    {
        const image = this.getImage()

        return {
            x: (image.width - (this.sprites-1)) / this.sprites,
            y: (image.height - (this.layers-1)) / this.layers
        }
    }
}