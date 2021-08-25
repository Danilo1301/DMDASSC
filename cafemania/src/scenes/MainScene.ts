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

        this.load.image('player/head', 'player/head.png')
        this.load.image('player/body1', 'player/body1.png')
        this.load.image('player/leg', 'player/leg.png')
        this.load.bitmapFont('gem', '/fonts/gem.png', '/fonts/gem.xml');
       
        this.loadTileItemInfo()
        this.loadDishes()
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

    private loadDishes()
    {
        const dishList = this.getGame().getDishItemFactory().getDishList()

        for (const id in dishList)
        {
            const dish = dishList[id]
            const texture = dish.texture

            this.load.image(texture, `dish/${texture}.png`)
        }
    }

    public async create(): Promise<void>
    {
        const network = this.getGame().getNetwork()

        network.events.on("connected", async () => {
            
            await this.startGameScene()

            const world = this.getGame().createClientWorld()

            network.send("loaded")
        })
        network.connect()
    }

    private async startGameScene()
    {
        const PlayerTextureFactory = (await import("../player/PlayerTextureFactory")).PlayerTextureFactory

        const tag = 'PlayerSpriteTexture_'

        SceneManager.startScene('GameScene', GameScene)
        SceneManager.startScene('HudScene', HudScene)
        SceneManager.startScene('MapGridScene', MapGridScene)

        await PlayerTextureFactory.create(tag + 'NoTexture', {})
        await PlayerTextureFactory.create(tag + 'TestClient', {head: ['player/head'], body: ['player/body1'], leg: ['player/leg']})
        await PlayerTextureFactory.create(tag + 'TestWaiter', {head: ['player/head'], leg: ['player/leg']})
        await PlayerTextureFactory.create(tag + 'TestCheff', {head: ['player/head']})
       
        
        
        this.scene.get('GameScene').scene.bringToTop()
        this.scene.get('MapGridScene').scene.bringToTop()
        this.scene.get('HudScene').scene.bringToTop()
        

        this.scene.remove('MainScene')
        console.log("[MainScene] Removed")
    }

    public update(time: number, delta: number): void
    {
        
    }
}