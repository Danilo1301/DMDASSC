import { Game } from '@cafemania/game/Game';
import Network from '@cafemania/network/Network';
import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { MainScene } from '@cafemania/scenes/MainScene';
import { WorldClient } from '@cafemania/world/WorldClient';

export class GameClient extends Game
{
    private _network: Network

    constructor()
    {
        super()

        this._network = new Network(this)
    }

    public getNetwork()
    {
        return this._network
    }

    public async start(): Promise<void>
    {
        await SceneManager.start(this)

        SceneManager.startScene('MainScene', MainScene)

        
        //const world = this.createServerWorld()

        this.setupResize()
    }

    private setupResize(): void
    {
        const game = SceneManager.getPhaser()
        const scaleManager = game.scale

        document.body.style.height = "100%"
        document.body.style.background = "#000000"
        game.canvas.style.width = "100%"
        game.canvas.style.height = "100%"
     
        const test = () => {
            //HudScene.getScene()?.events.emit("resize")

            const a = window.innerWidth / window.innerHeight

            const s = 1

            if(a < 1)
                scaleManager.setGameSize(600 * s, 900 * s)
            else
                scaleManager.setGameSize(1000, 600)
            
        }

        window.addEventListener('resize', () => test())
        test()
    }

    public createClientWorld(): WorldClient
    {
        const world = new WorldClient(this)
        return this.setupWorld(world)
    }
}