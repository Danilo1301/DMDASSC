import Game from "@cafemania/game/Game"
import Three from "@cafemania/three/Three";
import TileTextureFactory from "@cafemania/tile/TileTextureFactory";
import GameScene from "./scene/GameScene";
import HudScene from "./scene/HudScene";
import SceneManager from "./SceneManager";

export default class GameClient extends Game
{
    public async start(): Promise<void>
    {
        this.events.on("ready", this.setupClient.bind(this))

        await super.start()
    }

    private async setupClient()
    {
        this.startScene('GameScene', GameScene)
        this.startScene('HudScene', HudScene)

        document.body.style.height = "100%"
        
        //game.canvas.style.width = "100%"
        //game.canvas.style.height = "100%"

        const test = () => {
            const a = window.innerWidth / window.innerHeight

            if(a < 1)
            {
                SceneManager.getGame().scale.setGameSize(600, 900)
            }
            else
            {
                SceneManager.getGame().scale.setGameSize(900, 600)
            }

            //SceneManager.getGame().scale.setGameSize(window.innerWidth, window.innerHeight)

            /*
            SceneManager.getGame().scale.setGameSize(window.innerWidth, window.innerHeight)
            GameScene.getScene().scale.setGameSize( Math.round(700 * window.innerWidth/window.innerHeight), 730)
            if(window.innerWidth/window.innerHeight < 1) GameScene.getScene().cameras.main.setZoom( parseFloat((window.innerWidth/window.innerHeight).toFixed(2)) )
            */
        }

        window.addEventListener('resize', () => test())
        test()
        
        await Three.init()
        await TileTextureFactory.init()
    }
}