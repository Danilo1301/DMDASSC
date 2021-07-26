import TileItemRender from "@cafemania/tileItem/TileItemRender";
import Tile from "@cafemania/world/tile/Tile";
import BaseScene from "./BaseScene";

class MoveScene {
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

    public groundLayer?: Phaser.GameObjects.Layer
    public objectsLayer?: Phaser.GameObjects.Layer

    constructor()
    {
        super('GameScene')
    }

    public preload(): void
    {
        this.load.bitmapFont('gem', '/static/cafemania/assets/fonts/gem.png', '/static/cafemania/assets/fonts/gem.xml');


        this.load.setPath('/static/cafemania/assets')
        this.load.image('floor1', 'floor1.png')
        this.load.image('wall1', 'wall1.png')
        this.load.image('tile1', 'tile1.png')
        this.load.image('window1', 'window1.png')
        this.load.image('chair1', 'chair1.png')
    }
    public create(): void
    {
        this.groundLayer = this.add.layer()
        this.groundLayer.setDepth(0)

        this.objectsLayer = this.add.layer()
        this.objectsLayer.setDepth(100)
        
        this.cameras.main.setBackgroundColor(0x21007F)

        const moveScene = new MoveScene(this);

        for(let y = 0; y < 0; y++)
        {
            for(let x = 0; x < 0; x++)
            {
                const pos = Tile.getPosition(x, y)

                const tile = this.add.sprite(pos.x, pos.y, 'tile1')
            }
        }

        /*
        const tile1 = this.add.image(0, -150, 'tile1')
        const tile2 = this.add.image(120, -150, 'tile1')
        setInterval(() => {
            tile1.setPosition(tile1.x, tile1.y + 0.05)
            tile2.setPosition(tile2.x, tile2.y + 0.05)

            
            tile1.setDepth(tile1.y)
            tile2.setDepth(tile2.y)
        }, 1)
        */


        const game = this.getGame()

        game.events.emit("ready");

        this._fpsText = this.add.text(0, -300, `0 FPS`, {fontSize: '30px'})

        setInterval(() => {
            this._fpsText.setText(`${this.game.loop.actualFps} FPS`)
        })
    }

    public update()
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]

        world.render()
        
    }
}