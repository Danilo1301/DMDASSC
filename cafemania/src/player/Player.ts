import GameScene from "@cafemania/game/scene/GameScene"
import World from "@cafemania/world/World"

export default class Player
{
    private _creatingSprites: boolean = false
    private _sprite?: Phaser.GameObjects.Sprite

    constructor(world: World)
    {
        
    }

    public getScene()
    {
        return GameScene.getScene()
    }

    private async createSprite()
    {
        if(!this._creatingSprites)
        {
            this._creatingSprites = true

            const PlayerTextureFactory = await import("./PlayerTextureFactory")

            await PlayerTextureFactory.default.create(`playertexture1`)

      

            this._sprite = this.getScene().add.sprite(0, 0, 'playertexture1')
            this._sprite.setDepth(100000)
            //this._sprite.setOrigin(0, 0)

            //this._sprite.setFrame('TestLiftHand_2_0')

            console.log("t")

            this._creatingSprites = false

            this._sprite.anims.create({
                key: 'pulse',
                frames: this._sprite.anims.generateFrameNumbers('playertexture1', { }),
                frameRate: 5,
                repeat: -1
            });

            this._sprite.anims.play('pulse')
            
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