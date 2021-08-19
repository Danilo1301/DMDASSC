import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { BaseScene } from '@cafemania/scenes/BaseScene';
import { Tile } from '@cafemania/tile/Tile';
import { MoveScene, MPixelConfig } from '@cafemania/utils/MoveScene';
import { WorldText } from '@cafemania/utils/WorldText';
import { ZoomManager } from '@cafemania/utils/ZoomManager';
import { MapGridScene } from './MapGridScene';
import { Test3Scene } from './Test3Scene';

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

        this.groundLayer = this.add.layer()
        this.groundLayer.setDepth(0)

        this.objectsLayer = this.add.layer()
        this.objectsLayer.setDepth(100)

        this.cameras.main.setBackgroundColor(0x000D56)  

        this._moveScene = new MoveScene(this)

        this._zoom = new ZoomManager(this, this._moveScene)
        this._zoom.setZoom(0)

        this.drawWorldText("(0, 0)", new Phaser.Math.Vector2(0, 0), 'black')

        ///this.test()
    }

    private test()
    {
        for (let y = 0; y < 30; y++)
        {
            for (let x = 0; x < 24; x++)
            {
                const position = Tile.getTilePosition(x, y)

                this.add.image(position.x, position.y, 'floor/floor1')
                const img = this.add.image(position.x, position.y, 'floorDecoration/floorDecoration1')
                
            }
            
        }
        
        //this.add.image(0, 0, 'floorDecoration/floorDecoration1')
    }
    
    public update(time: number, delta: number): void
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]

        if(!world) return

        MapGridScene.grid = world.getGrid()

        if(world) {
            world.update(delta)
            world.render(delta)
        }
    }

    public drawWorldText(text: string, position: Phaser.Math.Vector2, color?: string)
    {
        new WorldText(this, text, position, color)
    }
}