interface PlayerAnimationInfo
{
    name: string
    frames: number
    frameOrder: number[]
    frameRate: number
}

export default class PlayerAnimations
{
    private static _animations: {[key: string]: PlayerAnimationInfo} = {
        "Walk": {
            name: 'Walk',
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 4
        },
        "Idle": {
            name: 'Idle',
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 2
        },
        "Sit": {
            name: 'Sit',
            frames: 1,
            frameOrder: [0],
            frameRate: 2
        },
        "Eat": {
            name: 'Eat',
            frames: 3,
            frameOrder: [0, 1, 2, 1],
            frameRate: 4
        },
    }

    public static getAnimations(): PlayerAnimationInfo[]
    {
        const anims: PlayerAnimationInfo[] = []

        for (const key in this._animations) {
            anims.push(this._animations[key])
        }

        return anims
    }
}