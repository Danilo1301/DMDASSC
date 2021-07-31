interface PlayerAnimationInfo
{
    name: string
    frames: number
}

export default class PlayerAnimations
{
    private static _animations = new Phaser.Structs.Map<string, PlayerAnimationInfo>([])

    public static init()
    {
        this.add('Walk', 3)
    }

    public static getAnimations(): PlayerAnimationInfo[]
    {
        return this._animations.values()
    }

    public static add(name: string, frames: number)
    {
        const anim: PlayerAnimationInfo = {
            name: name,
            frames: frames
        }

        this._animations.set(name, anim)
    }
}