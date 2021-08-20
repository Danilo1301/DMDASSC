import { PlayerDirection } from "./PlayerDirection";

interface IPlayerAnim
{
    name: string
    directions: PlayerDirection[]
    frames: number
    frameOrder: number[]
    frameRate: number
}

export class PlayerAnimation
{
    public static Animations: {[key: string]: IPlayerAnim} = {
        'Walk': {
            name: 'Walk',
            directions: [PlayerDirection.NORTH, PlayerDirection.SOUTH],
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 4
        },
        'Idle': {
            name: 'Idle',
            directions: [PlayerDirection.NORTH, PlayerDirection.SOUTH],
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 2
        },
        'Sit': {
            name: 'Sit',
            directions: [PlayerDirection.NORTH, PlayerDirection.SOUTH],
            frames: 1,
            frameOrder: [0],
            frameRate: 4
        },
        'Eat': {
            name: 'Eat',
            directions: [PlayerDirection.NORTH, PlayerDirection.SOUTH, PlayerDirection.EAST, PlayerDirection.WEST],
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 4
        }
    }
}