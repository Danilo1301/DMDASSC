import Three from "@cafemania/three/Three";
import Tile from "@cafemania/tile/Tile";
import BaseScene from "./BaseScene";

class MoveScene
{
    constructor(scene: Phaser.Scene)
    {
        let pointerDown = false;
        let startPos = new Phaser.Math.Vector2(0, 0);
        let startScenePos = new Phaser.Math.Vector2(0, 0);

        scene.input.on('pointerdown', pointer => {
            pointerDown = true;

            startPos.x = pointer.x
            startPos.y = pointer.y

            startScenePos.x = scene.cameras.main.scrollX
            startScenePos.y = scene.cameras.main.scrollY
        });

        scene.input.on('pointerup', () => {
            pointerDown = false;
        });

        scene.input.on('pointermove', pointer => {
            if(!pointerDown) return

            const delta = new Phaser.Math.Vector2(startPos.x - pointer.x, startPos.y - pointer.y);

            scene.cameras.main.setScroll(startScenePos.x + delta.x, startScenePos.y + delta.y)
        });
    }
}

export default class GameScene extends BaseScene
{
    private _fpsText!: Phaser.GameObjects.Text

    public groundLayer!: Phaser.GameObjects.Layer
    public objectsLayer!: Phaser.GameObjects.Layer

    constructor()
    {
        super('GameScene')
    }

    public preload(): void
    {
        this.load.bitmapFont('gem', '/static/cafemania/assets/fonts/gem.png', '/static/cafemania/assets/fonts/gem.xml');

        this.load.setPath('/static/cafemania/assets')
        this.load.image('floor1', 'floor1.png')
        this.load.image('floor2', 'floor2.png')
        this.load.image('wall1', 'wall1.png')
        this.load.image('tile1', 'tile1.png')
        this.load.image('window1', 'window1.png')
        this.load.image('chair1', 'chair1.png')

        this.load.image('eye', 'eye.png')
        this.load.image('eye2', 'eye2.png')
        this.load.image('head', 'head.png')
    }

    public create(): void
    {
        this.groundLayer = this.add.layer()
        this.groundLayer.setDepth(0)

        this.objectsLayer = this.add.layer()
        this.objectsLayer.setDepth(100)
        
        this.cameras.main.setBackgroundColor(0x21007F)

        const moveScene = new MoveScene(this);

        this._fpsText = this.add.text(0, -200, `0 FPS`, {fontSize: '30px',color: 'black'})
        this._fpsText.setDepth(100)

        setInterval(() => {
            this._fpsText.setText(`${this.game.loop.actualFps} FPS`)
        })

        this.getGame().events.emit("ready");

        this.getGame().createWorld()


        
    }

    public update(): void
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]

        if(world) world.render()
    }
    
}