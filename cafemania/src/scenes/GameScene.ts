import { BaseScene } from '@cafemania/scenes/BaseScene';
import { MoveScene } from '@cafemania/utils/MoveScene';
import { WorldText } from '@cafemania/utils/WorldText';
import { ZoomManager } from '@cafemania/utils/ZoomManager';
import { MapGridScene } from './MapGridScene';


export class GameScene extends BaseScene
{
    public static Instance: GameScene

    constructor()
    {
        super({})

        GameScene.Instance = this
    }

    public groundLayer!: Phaser.GameObjects.Layer
    public objectsLayer!: Phaser.GameObjects.Layer

    private _moveScene!: MoveScene

    private _zoom!: ZoomManager

    public get zoom(): ZoomManager
    {
        return this._zoom
    }

    public create(): void
    {
        window['GameScene'] = this

        this.setup()

        this.drawWorldText("(0, 0)", new Phaser.Math.Vector2(0, 0), 'black')

        this.cameras.main.setScroll(-671, 40)
    }

    private setup()
    {
        this.groundLayer = this.add.layer()
        this.groundLayer.setDepth(0)

        this.objectsLayer = this.add.layer()
        this.objectsLayer.setDepth(100)

        this.cameras.main.setBackgroundColor(0x000D56)  

        this._moveScene = new MoveScene(this)

        this._zoom = new ZoomManager(this, this._moveScene)
        this._zoom.setZoom(1)
    }
    
    public update(time: number, delta: number): void
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]

        if(!world) return

        MapGridScene.grid = world.getGrid()

        if(world)
        {
            world.update(delta)
            world.render(delta)
        }
    }

    public drawWorldText(text: string, position: Phaser.Math.Vector2, color?: string)
    {
        new WorldText(this, text, position, color)
    }
}