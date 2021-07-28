import Game from "@cafemania/game/Game"
import Player from "@cafemania/player/Player";
import Three, { ThreeDirection } from "@cafemania/three/Three";
import TileTextureFactory from "@cafemania/tileItem/TileTextureFactory";
import GameScene from "./scene/GameScene";
import SceneManager from "./SceneManager";

export default class GameClient extends Game
{
    public async start(): Promise<void>
    {
        await super.start()

        this.setGameScene(this.startScene('GameScene', GameScene));

        this.events.on("ready", this.onReady.bind(this))

        const game = SceneManager.getGame()

        document.body.style.height = "100%"
        //game.canvas.style.width = "100%"
        //game.canvas.style.height = "100%"

        const test = () => {
            this.getGameScene().scale.setGameSize( Math.round(700 * window.innerWidth/window.innerHeight), 725)
        }

        window.addEventListener('resize', () => {
            test()
        })

        test()
    }

    private async onReady(): Promise<void>
    {
        await Three.init()
        
        TileTextureFactory.init(this, this.getGameScene())
    }
}