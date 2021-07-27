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




        const texture = this.getGameScene().textures.createCanvas('aja', Three.size.x*2, Three.size.y)
        
        //this.getGameScene().textures.addCanvas('ajaxs', Three.renderer.domElement)
        //const imageData = texture.context.createImageData(400, 400);
        //imageData.data.set(pixels)

        //texture.context.putImageData(imageData, 0, 0)

        texture.context.drawImage(Three.renderer.domElement, 0, 0)

        Three.setDirection(ThreeDirection.FRONT)
        Three.animate()

        texture.context.drawImage(Three.renderer.domElement, Three.size.x, 0)

        texture.refresh()

        const img = this.getGameScene().add.image(0, 0, 'aja')
        img.setOrigin(0, 0)
        img.setDepth(100)

        TileTextureFactory.init(this, this.getGameScene())

        const world = this.createWorld()
    }
}