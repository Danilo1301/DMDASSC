import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { BaseScene } from './BaseScene';
import { GameScene } from './GameScene';
import { HudScene } from './HudScene';
import { MapGridScene } from './MapGridScene';

/*

Convert TileItemDirection to 
NORTH,
SOUTH,
EAST,
WEST,

Change the way TileItem rotates

Create method to convert PlayerDirection to Tile Offset and vice-versa
- Create method get tile item in front (Tile Offset)

Adjust Depth for TileItems that have PlaceType = WALL

Maybe change auto rotate to support New tile rotations if needed

Clear console logs


Global function to convert Direction into Tile Offset <<

*/

export class MainScene extends BaseScene
{
    public static Instance: MainScene

    constructor()
    {
        super({})

        MainScene.Instance = this
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')
        this.load.image('tile1', 'tile1.png')
        this.load.image('1x1white', '1x1white.png')
        this.load.image('wallMask', 'wallMask.png')
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

    public async create(): Promise<void>
    {
        const PTF = await import("../player/PlayerTextureFactory")

        const tag = 'PlayerSpriteTexture_'

        await PTF.PlayerTextureFactory.create(tag + 'NoTexture', {})
        //await PlayerTextureFactory.default.create(tag + 'TestClient', {head: ['head'], body: ['1x1white'], leg: ['1x1white']})
        //await PlayerTextureFactory.default.create(tag + 'TestWaiter', {head: ['head'], body: ['body2'], leg: ['1x1white']})
        
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