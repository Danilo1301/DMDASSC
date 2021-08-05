import { Direction } from "@cafemania/utils/Direction"
import Player from "./Player"

export default class PlayerAnimation
{
    private _player: Player

    private _currentDirection: Direction

    private _oldAnim: string = ""
    
    private _currentAnim: string = ""

    private _lastChangedFrame: number = -1
    private _currentFrame: number = 0

    constructor(player: Player)
    {
        this._player = player
        this._currentDirection = player.direction
    }

    public update(delta: number)
    {
        /*
        const now = new Date().getTime()

        if(this._currentAnim != this._oldAnim)
        {
            this._oldAnim = this._currentAnim

            this._currentFrame = 0

            console.log(`Animation is now ${this._currentAnim}`)
        }

        if(now - this._lastChangedFrame >= 200)
        {
            this._lastChangedFrame = now

            this._currentFrame += 1

            console.log(this._currentAnim, this._currentDirection, this._currentFrame)
        }

        console.log()
        */

     
        const playerDirection = this._player.direction

        if(this._oldAnim != this._currentAnim || this._currentDirection != playerDirection)
        {
            this._oldAnim = this._currentAnim
            this._currentDirection = playerDirection

            //console.log(`Animation is now ${this._currentAnim} (${this._currentDirection})`)
        
            if(!this._player.getSprite()) return

            const dirMap = new Map<Direction, number[]>()
            dirMap.set(Direction.NorthEast, [0, 0])
            dirMap.set(Direction.North, [1, 0])
            dirMap.set(Direction.East, [1, 1])
            dirMap.set(Direction.NorthWest, [2, 0])
            dirMap.set(Direction.SouthEast, [2, 1])
            dirMap.set(Direction.SouthWest, [3, 0])
            dirMap.set(Direction.South, [4, 0])
            dirMap.set(Direction.West, [4, 1])

            let dir = dirMap.get(this._player.direction)

            if(!dir) dir = [0, 0]

            const sprite = this._player.getSprite()



            const animKey = `${this._currentAnim}_${dir[0]}`
            sprite.anims.play(animKey)
            sprite.setScale(dir[1] === 1 ? -1 : 1, 1)
        }

    }

    public play(anim: string, forceChange?: boolean)
    {
        this._currentAnim = anim

        if(forceChange) this._oldAnim = ""
    }
}