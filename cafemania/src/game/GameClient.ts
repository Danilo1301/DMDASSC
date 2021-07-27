import Game from "@cafemania/game/Game"
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
        game.canvas.style.width = "100%"
        game.canvas.style.height = "100%"

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
        await Three.loadModel('/static/cafemania/assets/char.glb')
        Three.animate()

        window['Three'] = Three


        const frames = 5

        const texture = this.getGameScene().textures.createCanvas('aja', Three.size.x*frames, Three.size.y)

        for (let i = 0; i < frames; i++) {
            Three.setDirection(i)
            Three.animate()
            
            texture.context.drawImage(Three.renderer.domElement, Three.size.x * i, 0)
        }

        texture.refresh()

        const img = this.getGameScene().add.image(0, 300, 'aja')
        img.setOrigin(0, 0)
        img.setDepth(100)

        TileTextureFactory.init(this, this.getGameScene())

        const world = this.createWorld()
    }
}