import GameScene from "@cafemania/game/scene/GameScene"
import Tile from "@cafemania/tile/Tile"
import World from "@cafemania/world/World"

export default class Player
{
    private _sprite?: Phaser.GameObjects.Sprite

    private _container?: Phaser.GameObjects.Container

    private _position = new Phaser.Math.Vector2(0, 0)

    private _targetPosition = new Phaser.Math.Vector2(0, 0)

    private _walking: boolean = false

    private _direction = new Phaser.Math.Vector2(0, 0)

    private _id: string

    constructor(world: World, id: string)
    {
        this._id = id

        this._position.x = Tile.SIZE.x/2

        setTimeout(() => {
            setInterval(() => {
                if(!this._walking && this._sprite)
                {  
                    this._walking = true
    
                    this.walkToPosition(Tile.getPosition(Math.round(Math.random()*10), Math.round(Math.random()*10)).add(new Phaser.Math.Vector2(0, -Tile.SIZE.y/2)))
                }            
            }, Math.random()*1000)
        }, Math.random()*1000);

        

        
    }

    public walkToPosition(position: Phaser.Math.Vector2)
    {
        this._targetPosition = position
    }

    public getScene()
    {
        return GameScene.getScene()
    }

    private async createSprite(textureName?: string)
    {
        const scene = this.getScene()
        
        const useDefaultTexture = textureName === undefined

        if(textureName)
        {
            const PlayerTextureFactory = await import("./PlayerTextureFactory")

            await PlayerTextureFactory.default.create(textureName, {}) 
        } else {
            textureName = "PlayerSpritesTextureNoTexture"
        }

        if(this._sprite) this._sprite.destroy()

        this._sprite = this.getScene().add.sprite(0, 0, textureName)
        //this._sprite.setOrigin(0, 0)
        //this._sprite.setFrame('TestLiftHand_2_0')

 
        this._sprite.anims.create({
            key: 'test',
            frames: this._sprite.anims.generateFrameNumbers(textureName, { start: 15 }),
            frameRate: 4,
            repeat: -1
        });

        this._sprite.anims.play('test')

        this._container!.add(this._sprite)

        this._sprite.setPosition(0, -25)

        
        if(useDefaultTexture) this.createSprite('PlayerSpritesTexture' + this._id)
    }

    public render()
    {
        if(!this._container)
        {
            this._container = this.getScene().add.container(0, 0)

            GameScene.getScene().objectsLayer.add(this._container)

            this.createSprite()
        }

        this.processMovement()

        this._container.setPosition(this._position.x, this._position.y)
        this._container.setDepth(this._position.y + Tile.SIZE.y/2)
    }

    private processMovement()
    {
        if(!this._walking) return

        //
        const dir = Phaser.Math.Angle.BetweenPoints(this._position, this._targetPosition)

        const directions = [
            {x: 1, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: -1},

            {x: 1, y: -1},
            {x: 1, y: 1},

            {x: -1, y: 1},
            {x: -1, y: -1}
        ]

        let closestDir = 0
        let closestDirValue = -1

        for (const d of directions) {
            var dPos = Tile.getPosition(d.x, d.y)
            var r = Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, dPos)

            var v = Math.abs(r - dir)

            if(closestDirValue == -1 || v < closestDirValue)
            {
                closestDirValue = v
                closestDir = directions.indexOf(d)
            }
        }

        this._direction.x = directions[closestDir].x
        this._direction.y = directions[closestDir].y
        //

        var p = Tile.getPosition(this._direction.x, this._direction.y)

        const tp = p.normalize()
       
        const speed = 1.5
       
        this._position.x += tp.x * speed
        this._position.y += tp.y * speed

        if(Phaser.Math.Distance.BetweenPoints(this._position, this._targetPosition) < 5)
        {

            this._position.set(this._targetPosition.x, this._targetPosition.y)
            this._walking = false
        }
    }
}