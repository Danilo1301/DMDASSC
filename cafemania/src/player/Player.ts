import { Direction } from "@cafemania/utils/Direction";
import GameScene from "@cafemania/game/scene/GameScene"
import Tile from "@cafemania/tile/Tile"
import World from "@cafemania/world/World"
import PathFind from "../utils/PathFind";
import PlayerAnimation from "./PlayerAnimation";
import PlayerAnimations from "./PlayerAnimations";

import { v4 as uuidv4 } from 'uuid';
import TileItemChair from "@cafemania/tileItem/TileItemChair";

export default class Player
{
    private _sprite?: Phaser.GameObjects.Sprite

    private _container?: Phaser.GameObjects.Container

    private _position = new Phaser.Math.Vector2(0, 0)

    private _targetPosition = new Phaser.Math.Vector2(0, 0)

    private _isWalking: boolean = false

    private _onStopWalking?: () => void

    private _direction: Direction = Direction.East

    private _debugText?: Phaser.GameObjects.BitmapText

    private _id: string

    private _animation: PlayerAnimation

    private _world: World

    private _atTile?: Tile

    private _sittingAtChair?: TileItemChair

    constructor(world: World)
    {
        this._id = uuidv4();
        this._world = world
        this._animation = new PlayerAnimation(this)
    }

    public get id(): string { return this._id }

    public get direction(): Direction { return this._direction }

    public get isWalking() { return this._isWalking }

    public get isSitting() { return this._sittingAtChair != undefined }

    public getSprite()
    {
        return this._sprite!
    }

    public setAtTile(tile: Tile)
    {
        this._atTile = tile
        const position = tile.getCenterPosition()
        this._position.set(position.x, position.y)
    }

    public sitAtChair(chair: TileItemChair)
    {
        this._sittingAtChair = chair
    }

    public testWalkToTile(x: number, y: number, walkToEnd?: boolean, callback?: () => void)
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
                    this.moveToTile(p.x, p.y, () => resolve())
                })
            } 

            callback?.()
        })
    }

    public moveToTile(x: number, y: number, callback?: () => void)
    {
        const tile = this._world.getTile(x, y)
        const position = tile.getCenterPosition()

        this.moveToPosition(position, () => {
            this._atTile = tile
            callback?.()
        })
    }

    public moveToPosition(position: Phaser.Math.Vector2, callback?: () => void)
    {
        this._onStopWalking = callback
        this._targetPosition = position
        this._isWalking = true
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
            textureName = "PlayerSpritesTextureNoTexture"
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
        
        if(useDefaultTexture) this.createSprite('PlayerSpritesTexture' + this._id)
    }

    public update(delta: number)
    {
        this.processMovement(delta)
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
            this._debugText.setTint(0xffffff)
        }

        this._animation.update()

        this._container.setPosition(this._position.x, this._position.y)
        this._container.setDepth(this._position.y + Tile.SIZE.y/2)

        let str = `${this._sprite?.anims.currentFrame?.index}`
        
        //str += `\n${this._direction.x},${this._direction.y}`

        this._debugText.setText(str)
        this._debugText.setDepth(100000)
        this._debugText.setPosition(this._position.x, this._position.y)

        if(this._isWalking)
        {
            this._animation.play("Walk")
        } else {
            if(this.isSitting)
            {

            } else {
                this._animation.play("Idle")
            }
            
        }

        if(this.isSitting)
        {
            const chair = this._sittingAtChair!

            const directions = [
                Direction.East,
                Direction.South,
                Direction.West,
                Direction.North
            ]

            this._direction = directions[chair.direction]
        }
    }

    private processMovement(delta: number)
    {
        if(!this._isWalking) return

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

            if(closestDirValue == -1 || v < closestDirValue)
            {
                closestDirValue = v
                closestDir = directions.indexOf(d)
            }
        }

        this._direction = directions[closestDir].d

        const p = Tile.getPosition(directions[closestDir].x,directions[closestDir].y)
        const tp = p.normalize()
        const speed = 1.5

        this._position.x += tp.x * speed * delta * 0.05
        this._position.y += tp.y * speed * delta * 0.05

        if(Phaser.Math.Distance.BetweenPoints(this._position, this._targetPosition) < 2)
        {
            this._position.set(this._targetPosition.x, this._targetPosition.y)

            this._isWalking = false
            
            this._onStopWalking?.()
            this._onStopWalking = undefined
        }
    }
}