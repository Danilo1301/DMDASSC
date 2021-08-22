import { Game } from '@cafemania/game/Game';
import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { MainScene } from '@cafemania/scenes/MainScene';

export class GameClient extends Game
{
    constructor()
    {
        super()
    }

    public async start(): Promise<void>
    {
        await SceneManager.start(this)

        SceneManager.startScene('MainScene', MainScene)

        const world = this.createWorld()

        this.setupResize()
    }

    private setupResize(): void
    {
        const game = SceneManager.getPhaser()
        const scaleManager = game.scale

        document.body.style.height = "100%"
        //game.canvas.style.width = "100%"
        //game.canvas.style.height = "100%"
     
        const test = () => {
            //HudScene.getScene()?.events.emit("resize")

            const a = window.innerWidth / window.innerHeight

            if(a < 1)
                scaleManager.setGameSize(600 * 1, 900 * 1)
            else
                scaleManager.setGameSize(900, 600)
            
        }

        window.addEventListener('resize', () => test())
        test()
    }
}