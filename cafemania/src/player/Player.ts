import GameScene from "@cafemania/game/scene/GameScene"
import PlayerTextureFactory from "./PlayerTextureFactory"

export default class Player
{
    public _scene!: GameScene

    private _createdSprites: boolean = false

    constructor()
    {

    }

    public getScene()
    {
        return this._scene!
    }

    public async render()
    {
        console.log("render")

        if(!this._createdSprites)
        {
            this._createdSprites = true

            await PlayerTextureFactory.create()

            var img = this.getScene().add.image(0, 0, 'tmp')
            img.setDepth(100000)
            img.setScale(0.2)
        }
    }
}