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
    constructor()
    {
        super('GameScene')
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets')
        this.load.image('wall0', 'wall0.png')
        this.load.image('tile1', 'tile1.png')
        this.load.image('tile2', 'tile2.png')
        this.load.image('tile3', 'tile3.png')
        this.load.image('tile4', 'tile4.png')
        this.load.image('block4', 'block4.png')
        this.load.image('tubatu', 'tubatu.png')
        this.load.image('chair0', 'chair0.png')
        this.load.image('3by3', '3by3.png')
        this.load.image('2by3', '2by3.png')
        this.load.image('1by1', '1by1.png')
    }
    public create(): void
    {
        
        this.cameras.main.setBackgroundColor(0x21007F)

        const moveScene = new MoveScene(this);

        const tile1 = this.add.image(0, -150, 'tile1')
        const tile2 = this.add.image(120, -150, 'tile1')
        setInterval(() => {
            tile1.setPosition(tile1.x, tile1.y + 0.05)
            tile2.setPosition(tile2.x, tile2.y + 0.05)

            
            tile1.setDepth(tile1.y)
            tile2.setDepth(tile2.y)
        }, 1)


        const game = this.getGame()

        game.events.emit("ready");
    }

    public update()
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]

        world.render()
        
    }
}