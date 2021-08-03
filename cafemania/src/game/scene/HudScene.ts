import BaseScene from "./BaseScene";
import GameScene from "./GameScene";

export default class HudScene extends BaseScene
{
    private static _instance: HudScene

    public static getScene() { return this._instance }

    private _fpsText!: Phaser.GameObjects.Text

    constructor()
    {
        super('HudScene')

        HudScene._instance = this
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets')
        this.load.image('button/zoom_in', 'button/zoom_in.png')
        this.load.image('button/zoom_out', 'button/zoom_out.png')
    }

    public create(): void
    {
        let currentZoom = 1
        let zoomList = [2, 1, 0.5]

        const zoomIn = this.add.sprite(30, 80, 'button/zoom_in')
        const zoomOut = this.add.sprite(30, 140, 'button/zoom_out')

        zoomIn.setInteractive()
        zoomOut.setInteractive()

        const camera = GameScene.getScene().cameras.main

        zoomIn.on('pointerdown', function (pointer) {
            currentZoom--
            if(currentZoom < 0) currentZoom = 0

            camera.setZoom(zoomList[currentZoom])
        })

        zoomOut.on('pointerdown', function (pointer) {
            currentZoom++
            if(currentZoom >= zoomList.length) currentZoom = zoomList.length-1

            camera.setZoom(zoomList[currentZoom])
        })

        this._fpsText = this.add.text(10, 10, `0 FPS`, {fontSize: '30px',color: 'black'})
        this._fpsText.setDepth(100)

        setInterval(() => {
            this._fpsText.setText(`${Math.round(this.game.loop.actualFps)} FPS`)
        }, 500)
    }

    public update(): void
    {
 
    }
}