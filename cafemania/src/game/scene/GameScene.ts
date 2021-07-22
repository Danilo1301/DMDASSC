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
    private _moveScene?: MoveScene;

    private _collisionLayer?: Phaser.GameObjects.Layer

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
    }

    public create(): void
    {
        this.cameras.main.setBackgroundColor(0x21007F)

        this._moveScene = new MoveScene(this);

        this._collisionLayer = this.add.layer();
        this._collisionLayer.setDepth(0)
        
        const game = this.getGame()

        game.events.emit("ready");
        
    
        const tileItemRender2 = game.tileItemFactory.createTileItemRender('chao0')

        const tileItemRender = game.tileItemFactory.createTileItemRender('fogao0')

        const testTileItemRender = (t: TileItemRender, startAt: number, x: number, y: number) => {
            const newOrigin = Tile.getPosition(x, y)
            t.setPosition(newOrigin.x, newOrigin.y)

            let n = startAt

            setInterval(() => {
    
                n++
                if(n >= 6) n = 0
    
                t.setLayer(n%2)
    
                t.setIsTransparent(n == 0)
                t.setDirection(n == 3 ? -1 : 1)
            }, 200)
        }

        testTileItemRender(tileItemRender, 0,  -2, -4)
        testTileItemRender(tileItemRender2, 2,  -2, -2)
    }

    public update()
    {
        this.renderTiles()
    }

    private renderTiles()
    {
        const game = this.getGame()
        const world = game.getWorlds()[0]
        const tiles = world.getTiles();
        const scene = this;

        for (const tile of tiles)
        {
            tile.render()

            

            if(this._collisionLayer)
            {
                /*
                let collision = tile.getCollisionBox()

                if(collision)
                {
                    if(!this._collisionLayer?.getChildren().includes(collision))
                    {
                        this._collisionLayer?.add(collision)
                    }
                }
                */
            }
        }
    }
}