import { Direction } from "@cafemania/game/Direction"
import Player from "./Player"

export default class PlayerAnimation
{
    private _player: Player

    private _currentDirection: Direction

    private _oldAnim: string = ""
    
    private _currentAnim: string = ""

    constructor(player: Player)
    {
        this._player = player
        this._currentDirection = player.direction
    }

    public update()
    {
        const playerDirection = this._player.direction

        if(this._oldAnim != this._currentAnim || this._currentDirection != playerDirection)
        {
            this._oldAnim = this._currentAnim
            this._currentDirection = playerDirection
        
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