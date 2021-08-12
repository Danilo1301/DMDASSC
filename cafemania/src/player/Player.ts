import { Direction } from "@cafemania/utils/Direction";
import GameScene from "@cafemania/game/scene/GameScene"
import Tile from "@cafemania/tile/Tile"
import World from "@cafemania/world/World"
import PathFind from "../utils/PathFind";
import PlayerAnimation from "./PlayerAnimation";
import PlayerAnimations from "./PlayerAnimations";

import { v4 as uuidv4 } from 'uuid';
import TileItemChair from "@cafemania/tileItem/TileItemChair";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import PlayerClient from "./PlayerClient";
import PlayerWaiter from "./PlayerWaiter";
import TaskManager, { TaskExecuteAction } from "./TaskManager";
import { TaskWalkToTile } from "./PlayerTasks";

export default class Player
{
    public name?: string

    private _sprite?: Phaser.GameObjects.Sprite

    private _container?: Phaser.GameObjects.Container

    private _position = new Phaser.Math.Vector2(0, 0)

    private _targetPosition = new Phaser.Math.Vector2(0, 0)

    private _targetTile?: Tile

    private _isEating: boolean = false

    private _isWalking: boolean = false

    private _onStopWalking?: () => void

    private _depth: number = 0

    private _direction: Direction = Direction.East

    private _moveDirection = new Phaser.Math.Vector2(0, 0)

    private _debugText?: Phaser.GameObjects.BitmapText

    private _id: string

    private _animation: PlayerAnimation

    private _world: World

    private _atTile?: Tile

    private _sittingAtChair?: TileItemChair

    private _taskManager: TaskManager

    private _finalTargetTile?: Tile

    constructor(world: World)
    {
        this._id = uuidv4();
        this._world = world
        this._animation = new PlayerAnimation(this)
        this._taskManager = new TaskManager()

        if(world.tileExists(0, 0)) this.setAtTile(world.getTile(0, 0))
    }

    protected _isWaiter: boolean = false

    protected _isClient: boolean = false

    protected _isCheff: boolean = false

    public get id(): string { return this._id }

    public get direction(): Direction { return this._direction }

    public get isWalking() { return this._isWalking }

    public get isSitting() { return this._sittingAtChair != undefined }

    public get isEating() { return this._isEating }

    public getPosition()
    {
        return this._position
    }

    public get isWaiter() {
        return this._isWaiter
    }

    public get isClient() {
        return this.isClient
    }

    public get isCheff() {
        return this._isCheff
    }
    
    public getTaskManager()
    {
        return this._taskManager
    }

    public setIsWalking(value: boolean)
    {
        this._isWalking = value
    }

    public getWorld()
    {
        return this._world
    }

    public getSprite()
    {
        return this._sprite!
    }

    public getAtTile()
    {
        return this._atTile!
    }

    public setAtTile(tile: Tile)
    {
        const position = tile.getCenterPosition()
        
        this._atTile = tile

        this.setPosition(position.x, position.y)

        if(!this.isSitting)
        {
            const chairs = <TileItemChair[]> tile.getTileItemsOfType(TileItemType.CHAIR)
    
            if(chairs.length > 0) this.setAtChair(chairs[0])
        }
    }

    public setId(id: string)
    {
        this._id = id
    }

    public setPosition(x: any, y: any) 
    {
        this._position.set(x, y)
    }

    public setTargetPosition(x: any, y: any) 
    {
        this._targetPosition.set(x, y)
    }

    public stopSitting()
    {
        const chair = this._sittingAtChair

        if(chair) {
            chair.setReserved(false)
            chair.setPlayerSitting(undefined)
        }

        this._sittingAtChair = undefined
    }

    public setAtChair(chair: TileItemChair)
    {
        this._sittingAtChair = chair

        chair.setPlayerSitting(this)

        this.setAtTile(chair.getTile())
    }


    public taskWalkToTile(tile: Tile, dontEnterTile?: boolean)
    {
        this._finalTargetTile = tile

        this._taskManager.addTask(new TaskWalkToTile(this, tile, dontEnterTile))
    }

    public taskExecuteAction(action: () => void)
    {
        this._taskManager.addTask(new TaskExecuteAction(action))
    }

    public _testWalkToTile(x: number, y: number, walkToEnd?: boolean, callback?: () => void)
    {
        const pathFind = new PathFind()
        const ocuppiedMap = this._world.getOccupiedTilesMap()

        for (const tile of this._world.getTiles())
        {
            let canWalk = !ocuppiedMap[`${tile.x}:${tile.y}`]

            if(walkToEnd)
                if(tile.x == x && tile.y == y) canWalk = true

            pathFind.add(tile.x, tile.y, canWalk)
        }

        const atX = this._atTile?.x || 0
        const atY = this._atTile?.y || 0

        pathFind.setStart(atX, atY)
        pathFind.setEnd(x, y)
        pathFind.find(async (path) => {
            if(path.length == 0) return

            path.splice(0, 1)

            for (const p of path) {
                await new Promise<void>(resolve => {
                    this.moveToTile(p.x, p.y, () => {

                        if(p.x == x && p.y == y) {
                            callback?.()
                        } else {
                            this._isWalking = true
                        }

                        //console.log("Thats the callback")
                        resolve()
                    })
                })
            } 

            
        })
    }

    public moveToTile(x: number, y: number, callback?: () => void)
    {
        const tile = this._world.getTile(x, y)
        const position = tile.getCenterPosition()

        this._targetTile = tile

        this.moveToPosition(position, () => {

            this._atTile = tile
            this._targetTile = undefined
            callback?.()
        })
    }

    public moveToPosition(position: Phaser.Math.Vector2, callback?: () => void)
    {
        //console.log(`[Player] Move to position`)

        this._onStopWalking = callback
        this._targetPosition = position
        this._isWalking = true

        const dir = Phaser.Math.Angle.BetweenPoints(this._position, this._targetPosition)

        const directions = [
            {x: 1, y: 0, d: Direction.West},
            {x: -1, y: 0, d: Direction.East},
            {x: 0, y: 1, d: Direction.North},
            {x: 0, y: -1, d: Direction.South},

            {x: 1, y: -1, d: Direction.SouthWest},
            {x: 1, y: 1, d: Direction.NorthWest},

            {x: -1, y: 1, d: Direction.NorthEast},
            {x: -1, y: -1, d: Direction.SouthEast}
        ]

        let closestDir = 0
        let closestDirValue = -1

        for (const d of directions) {
            var dPos = Tile.getPosition(d.x, d.y)
            var r = Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, dPos)

            var v = Math.abs(r - dir)

            if(closestDirValue == -1 || (v < closestDirValue))
            {
                closestDirValue = v
                closestDir = directions.indexOf(d)
            }
        }

        this._direction = directions[closestDir].d

        this._moveDirection.x = directions[closestDir].x
        this._moveDirection.y = directions[closestDir].y
        
        console.log(directions[closestDir])
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
        } 
        else
        {
            //PlayerSpriteTexture_NoTexture
            textureName = this.isWaiter ? "PlayerSpriteTexture_TestWaiter" : 'PlayerSpriteTexture_TestClient'
        }

        if(this._sprite) this._sprite.destroy()

        this._sprite = scene.add.sprite(0, 0, textureName)

        let f = 0

        for (const anim of PlayerAnimations.getAnimations())
        {
            for (let direction = 0; direction < 5; direction++)
            {
                const frames: number[] = []

                anim.frameOrder.map(af => frames.push(af + f))

                const animKey = `${anim.name}_${direction}`

                this._sprite.anims.create({
                    key: animKey,
                    frames: this._sprite.anims.generateFrameNumbers(textureName, {frames: frames}),
                    frameRate: anim.frameRate,
                    repeat: -1
                });

               f += anim.frames
            }
        }

        this._container!.add(this._sprite)

        this._sprite.setPosition(0, -25)

        this._animation.play('Idle', true)
        
        //if(useDefaultTexture) this.createSprite('PlayerSpritesTexture' + this._id)
    }

    public setIsEating(isEating: boolean)
    {
        this._isEating = isEating
    }

    public update(delta: number)
    {
        this._taskManager.update(delta)

        this.processMovement(delta)

        this.processAnimations(delta)
    }

    public processAnimations(delta: number)
    {
        if(this.isSitting)
        {
            const chair = this._sittingAtChair!

            const directions = [
                Direction.East,
                Direction.South,
                Direction.West,
                Direction.North
            ]


            //const d = (chair.getTileItemRender().getDepth() - chair.getDepth())

            const tileItemRender = chair.getTileItemRender()

            const d = tileItemRender ? tileItemRender.getDepth() : 0

            const depths = [
                5,
                -1,
                -5,
                5
            ]

            this._direction = directions[chair.direction]

            this._depth = d + depths[chair.direction]

            if(this._sittingAtChair)
            {
                const isEating = this._sittingAtChair.getTableInFront()?.hasDish

                if(!this.isEating && isEating)
                {
                    this.setIsEating(true)
                }
            }

        } else {
            this._depth = this._position.y + Tile.SIZE.y/2
        }

        if(this._isWalking)
        {
            this._animation.play("Walk")
        } else {
            if(this.isSitting)
            {
                if(this._isEating)
                {
                    this._animation.play("Eat")
                } else {
                    this._animation.play("Sit")
                }
                
            } else {
                this._animation.play("Idle")
            }
            
        }

        this._animation.update(delta)
    }

    public render()
    {
        const scene = this.getScene()

        if(!this._container)
        {
            this._container = scene.add.container(0, 0)

            scene.objectsLayer.add(this._container)

            this.createSprite()
        }

        if(!this._debugText)
        {
            this._debugText = scene.add.bitmapText(0, 0, 'gem', `${this._id}`, 16).setOrigin(0.5);
            this._debugText.setTint(0x0000ff)
        }

        this._container.setPosition(this._position.x, this._position.y)
        this._container.setDepth(this._depth)

        let str = `${this._sprite?.anims.currentFrame?.index}`

        str += `\n${this._depth}`

        if(this.name)
        {
            str += `\n(Online Player)\n${this.name}`

            this._debugText.setTint(0xff0000)
        }
        
        //str += `\n${this._direction.x},${this._direction.y}`

        this._debugText.setText(str)
        this._debugText.setDepth(100000)
        this._debugText.setPosition(this._position.x, this._position.y)
    }

    private processMovement(delta: number)
    {
        if(!this._isWalking) return

        const speed = 1.5

        const ang = Phaser.Math.Angle.BetweenPoints(this._position, this._targetPosition)

        this._position.x += speed * Math.cos(ang) * delta * 0.05
        this._position.y += speed * Math.sin(ang) * delta * 0.05

        if(Phaser.Math.Distance.BetweenPoints(this._position, this._targetPosition) < delta / speed * 0.5)
        {
            //console.log(`[Player] Reached target position`)

            //this._position.set(this._targetPosition.x, this._targetPosition.y)

            this._isWalking = false
            
            //console.log(`[Player] Calling onStopWalking`)

            this._onStopWalking?.()
            this._onStopWalking = undefined
        }

        return

        const moveDirection = this._moveDirection

        const p = Tile.getPosition(moveDirection.x, moveDirection.y)
        const tp = p.normalize()
        //const speed = 1.5

        this._position.x += tp.x * speed * delta * 0.05
        this._position.y += tp.y * speed * delta * 0.05

        console.log(delta)

        if(Phaser.Math.Distance.BetweenPoints(this._position, this._targetPosition) < 10)
        {
            //console.log(`[Player] Reached target position`)

            //this._position.set(this._targetPosition.x, this._targetPosition.y)

            this._isWalking = false
            
            //console.log(`[Player] Calling onStopWalking`)

            this._onStopWalking?.()
            this._onStopWalking = undefined
        }
    }

    public serialize()
    {
        var data: any = {
            id: this.id,
            position: {
                x: this._position.x,
                y: this._position.y
            },
            atTile: {
                x: this._atTile?.x || 0,
                y: this._atTile?.y || 0
            }
        }

        if(this._finalTargetTile)
        {
            data.targetTile = {
                x: this._finalTargetTile.x,
                y: this._finalTargetTile.y
            }
        }

        return data
    }

    public destroy()
    {
        this._sprite?.destroy()
        this._container?.destroy()
        this._debugText?.destroy()
    }
}

