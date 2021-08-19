import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { BaseScene } from './BaseScene';
import { GameScene } from './GameScene';
import { HudScene } from './HudScene';
import { MapGridScene } from './MapGridScene';

export class MainScene extends BaseScene
{
    public static Instance: MainScene

    constructor()
    {
        super({})
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')
        this.load.image('tile1', 'tile1.png')
        this.load.image('1x1white', '1x1white.png')
        this.load.bitmapFont('gem', '/fonts/gem.png', '/fonts/gem.xml');
       
        this.loadTileItemInfo()
    }

    private loadTileItemInfo()
    {
        const tileItemInfoList = this.getGame().getTileItemFactory().getTileItemInfoList()

        for (const id in tileItemInfoList)
        {
            const tileItemInfo = tileItemInfoList[id]
            const texture = tileItemInfo.texture

            this.load.image(texture, `tileItem/${texture}.png`)
        }
    }

    public create(): void
    {
        SceneManager.startScene('GameScene', GameScene)
        SceneManager.startScene('HudScene', HudScene)
        SceneManager.startScene('MapGridScene', MapGridScene)

        this.scene.remove('MainScene')
        console.log("[MainScene] Removed")
    }

    public update(time: number, delta: number): void
    {
        console.log("[MainScene] Update")
    }
}