import GameScene from "@cafemania/game/scene/GameScene"
import World from "@cafemania/world/World"
import PlayerTextureFactory from "./PlayerTextureFactory"

export default class Player
{
    public _scene: GameScene

    private _creatingSprites: boolean = false
    private _sprite?: Phaser.GameObjects.Sprite

    constructor(world: World)
    {
        this._scene = world.getGame().getGameScene()
    }

    public getScene()
    {
        return this._scene!
    }

    private async createSprite()
    {
        if(!this._creatingSprites)
        {
            this._creatingSprites = true

            await PlayerTextureFactory.create(`playertexture1`)

            this._sprite = this.getScene().add.sprite(0, 0, 'playertexture1')
            this._sprite.setDepth(100000)

            this._creatingSprites = false
        } 
    }

    public render()
    {
        if(!this._sprite)
        {
            this.createSprite()
        }
    }
}