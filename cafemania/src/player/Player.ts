import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { Direction } from "@cafemania/utils/Direction";
import { World } from "@cafemania/world/World"
import { v4 as uuidv4 } from 'uuid';
import { PlayerAnimation } from "./PlayerAnimation";
import { TaskPlayAnim, TaskWalkToTile } from "./PlayerTasks";
import { TaskExecuteAction, PlayerTaskManager } from "./PlayerTaskManager";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";

enum PlayerState
{
    IDLE,
    WALKING,
    SITTING,
    EATING
}

export class Player
{
    private _world: World

    private _id: string

    private _position = new Phaser.Math.Vector2()

    private _debugText?: Phaser.GameObjects.BitmapText

    private _atTile: Tile

    private _state: PlayerState = PlayerState.IDLE

    private _finalTargetTile: Tile | undefined
    private _targetTile: Tile | undefined
    private _targetTileDistance: number = 0
    private _distanceMoved: number = 0
    private _moveToTileCallback?: () => void

    private _container?: Phaser.GameObjects.Container

    private _sprite?: Phaser.GameObjects.Sprite

    private _taskManager: PlayerTaskManager

    private _speed: number = 1.6

    private _direction: Direction = Direction.NORTH

    private _animation: PlayerAnimation

    private _depth: number = 0

    private _sittingAtChair: TileItemChair | undefined

    constructor(world: World)
    {
        this._world = world
        this._id = uuidv4()

        this._animation = new PlayerAnimation(this)
        this._taskManager = new PlayerTaskManager()

        this._atTile = world.getTile(0, 0)

        window['player'] = this
    }

    public get id()
    {
        return this._id
    }

    public get direction()
    {
        return this._direction
    }

    public isWalking()
    {
        return this._state == PlayerState.WALKING
    }

    public getSprite()
    {
        return this._sprite
    }

    public setAtTile(x: number, y: number)
    {
        const tile = this.getWorld().getTile(x, y)

        this.setPosition(tile.getPosition())

        this._atTile = tile

    }

    public getAtTile()
    {
        return this._atTile
    }

    public getTaskManager()
    {
        return this._taskManager
    }

    public getPosition()
    {
        return new Phaser.Math.Vector2(this._position.x, this._position.y)
    }

    public setPosition(position: Phaser.Math.Vector2)
    {
        this._position.set(position.x, position.y)
    }

    public getWorld()
    {
        return this._world
    }

    public sitAtChair(chair: TileItemChair)
    {
        this._sittingAtChair = chair
        this._state = PlayerState.SITTING
    }

    public update(delta: number)
    {
        this._taskManager.update(delta)

        if(this._targetTile)
        {
            const speed = this._speed

            const ang = Phaser.Math.Angle.BetweenPoints(this._position, this._targetTile.getCenterPosition())
    
            // * delta * 0.05

            const moveDir = new Phaser.Math.Vector2(
                Math.cos(ang),
                Math.sin(ang)
            ).normalize()

            
            const move = new Phaser.Math.Vector2(
                moveDir.x * speed * delta * 0.05,
                moveDir.y * speed * delta * 0.05
            )

            this._position.x += move.x
            this._position.y += move.y

            this._distanceMoved += move.length()

            if(this._distanceMoved >= this._targetTileDistance)
            {
                this.setPosition(this._targetTile.getPosition())

                this._atTile = this._targetTile

                this._targetTile = undefined
                this._moveToTileCallback?.()

                if(this._atTile == this._finalTargetTile)
                {
                    this._finalTargetTile = undefined

                    this._state = PlayerState.IDLE
                }

                
            }
        }


        this.handleSittingAtChair()
    }

    private handleSittingAtChair()
    {
        const chair = this._sittingAtChair

        if(!chair) return
        
        this.setPosition(chair.getPosition())

        this._direction = chair.direction
        
        enum ChairRestPosDepth
        {
            IN_FRONT_OF_PLAYER = 1,
            BEHIND_OF_PLAYER = 6
        }

        const isBehind = this.direction == Direction.SOUTH || this.direction == Direction.EAST

        this._depth = isBehind ? ChairRestPosDepth.BEHIND_OF_PLAYER : ChairRestPosDepth.IN_FRONT_OF_PLAYER
    }

    public render(delta: number)
    {
        const scene = GameScene.Instance

        if(!this._debugText)
        {
            //this._debugText = scene.add.bitmapText(0, 0, 'gem', `Player`).setFontSize(14).setTint(0)
        }

        //this._debugText?.setPosition(this._position.x, this._position.y)


        if(!this._container)
        {
            this._container = scene.add.container(0, 0)

            scene.objectsLayer.add(this._container)

            this.createSprite()
        }

        this._container?.setPosition(this._position.x, this._position.y)
        this._container?.setDepth(this._position.y + this._depth)

        this._animation.update(delta)

        switch (this._state)
        {
            case PlayerState.EATING:
                this._animation.play('Eat')
                break
            case PlayerState.SITTING:
                this._animation.play('Sit')
                break
            case PlayerState.WALKING:
                this._animation.play('Walk')
                break
            default:
                this._animation.play('Idle')
        }
    }

    private async createSprite(textureName?: string)
    {
        const scene = GameScene.Instance
        
        const useDefaultTexture = textureName === undefined

        if(textureName)
        {
            const PTF = await import("./PlayerTextureFactory")

            await PTF.PlayerTextureFactory.create(textureName, {}) 
        } 
        else
        {
            textureName = 'PlayerSpriteTexture_NoTexture'
            textureName = 'PlayerSpriteTexture_TestClient'

            //PlayerSpriteTexture_NoTexture
            //textureName = this.isWaiter ? "PlayerSpriteTexture_TestWaiter" : 'PlayerSpriteTexture_TestClient'
        }

        if(this._sprite) this._sprite.destroy()

        
        this._sprite = scene.add.sprite(0, 40, textureName)
        this._sprite.setScale(1.05)
        this._sprite.setOrigin(0.5, 1)
        this._sprite.setFrame(`Idle_0_0`)

        this._container!.add(this._sprite)
    }

    public moveToTile(x: number, y: number, callback?: () => void)
    {
        const tile = this.getWorld().getTile(x, y)
        const atTile = this._atTile

        const dir = new Phaser.Math.Vector2(tile.x - atTile.x, tile.y - atTile.y).normalize()

        dir.x = Math.round(dir.x)
        dir.y = Math.round(dir.y)

        this._targetTile = tile
        this._targetTileDistance = Phaser.Math.Distance.BetweenPoints(this._position, tile.getPosition())

        this._distanceMoved = 0

        this._moveToTileCallback = callback


        //console.log(dir.x, dir.y)
        const direction = Tile.getDirectionFromOffset(dir.x, dir.y)

        this._direction = direction

        this._state = PlayerState.WALKING
    }

    public taskWalkToTile(x: number, y: number, dontEnterTile?: boolean)
    {
        this._finalTargetTile = this.getWorld().getTile(x, y)
     
        this._taskManager.addTask(new TaskWalkToTile(this, x, y, dontEnterTile))
    }

    public taskPlayAnim(anim: string, time: number)
    {
        this._taskManager.addTask(new TaskPlayAnim(this, anim, time))
    }

    public taskExecuteAction(action: () => void)
    {
        this._taskManager.addTask(new TaskExecuteAction(action))
    }
}