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

            const zoom = scene.cameras.main.zoom

            /*
            scene.cameras.main.setScroll(
                startScenePos.x + (delta.x / zoom),
                startScenePos.y + (delta.y / zoom)
            )
            */

            scene.cameras.main.setScroll(
                Math.round(startScenePos.x + (delta.x / zoom)),
                Math.round(startScenePos.y + (delta.y / zoom))
            )

            //console.log(zoom, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
        });
    }
}

export default class GameScene extends BaseScene
{
    private static _instance: GameScene

    public static getScene() { return this._instance }
    
    public groundLayer!: Phaser.GameObjects.Layer
    public objectsLayer!: Phaser.GameObjects.Layer

    private _loaded: boolean = false

    constructor()
    {
        super('GameScene')

        GameScene._instance = this
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')
        this.load.bitmapFont('gem', '/fonts/gem.png', '/fonts/gem.xml');
        this.load.image('floor1', 'floor1.png')
        this.load.image('floor2', 'floor2.png')
        this.load.image('table1', 'table1.png')
        this.load.image('wall1', 'wall1.png')
        this.load.image('tile1', 'tile1.png')
        this.load.image('window1', 'window1.png')
        this.load.image('chair1', 'chair1.png')
        this.load.image('stove1', 'stove1.png')
        this.load.image('stove2', 'stove2.png')
        this.load.image('1x1white', '1x1white.png')
        this.load.image('eye', 'eye.png')
        this.load.image('eye2', 'eye2.png')
        this.load.image('head', 'head.png')
        this.load.image('body1', 'body1.png')
        this.load.image('body2', 'body2.png')
        this.load.image('2by3', '2by3.png')
    }

    public create(): void
    {
        this.groundLayer = this.add.layer()
        this.groundLayer.setDepth(0)

        this.objectsLayer = this.add.layer()
        this.objectsLayer.setDepth(100)
        
        this.cameras.main.setBackgroundColor(0x21007F)

        const moveScene = new MoveScene(this);

        this.test()
    }

    private async test()
    {
        const textureName = 'PlayerSpritesTextureNoTexture'

        const PlayerTextureFactory = await import("../../player/PlayerTextureFactory")
        await PlayerTextureFactory.default.create(textureName, {default: true})

        console.log(textureName)

        this._loaded = true

        this.drawWorldText("AOE================", new Phaser.Math.Vector2(0, 0))
    }

    public update(time: number, delta: number): void
    {
        if(!this._loaded) return
        
        const game = this.getGame()
        const world = game.getWorlds()[0]

        if(world) {
            world.update(delta)
            world.render()
        }
    }

    public drawWorldText(text: string, position: Phaser.Math.Vector2, color?: string)
    {
        const worldText = this.add.text(position.x, position.y, text, {color: color || "black", fontStyle: "bold"})
        worldText.setDepth(10000)

        let n = 0

        const interval = setInterval(() => {
            worldText.setPosition(worldText.x, worldText.y - 0.2)

            n++

            if(n >= 600)
            {
                clearInterval(interval)
                
                worldText.destroy()
            }
        }, 1)
    }
}