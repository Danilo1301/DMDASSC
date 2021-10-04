import { PlayerTextureFactory } from '@cafemania/player/PlayerTextureFactory';
import { BaseScene } from '@cafemania/scenes/BaseScene';
import Three from '@cafemania/three/Three';
import { FPSCounter } from '@cafemania/utils/FPSCounter';
import { NotificationBar } from '@cafemania/utils/NotificationBar';
import { GameScene } from './GameScene';

export class HudScene extends BaseScene {

    public static Instance: HudScene;

    public events = new Phaser.Events.EventEmitter();

    private _notification!: NotificationBar;

    constructor() {
        super({});
        HudScene.Instance = this
        window['HudScene'] = this
    }

    public preload() {
        this.load.setPath('/static/cafemania/assets');
        this.load.image('button/zoom_in', 'button/zoom_in.png');
        this.load.image('button/zoom_out', 'button/zoom_out.png');
        this.load.image('button/fullscreen', 'button/fullscreen.png');
    }

    public addNotification(text: string, textColor?: number, backgroundColor?: number) {
        this._notification?.addItem(text, textColor, backgroundColor);
    }

    public create() {
        this._notification = new NotificationBar(this);

        FPSCounter.addToScene(this);

        this.createZoomButtons();

        this.scene.bringToTop();

    }

    public update(time: number, delta: number) {
    }

    private createZoomButtons() {
        const zoomIn = this.add.sprite(0, 0, 'button/zoom_in')
        const zoomOut = this.add.sprite(0, 0, 'button/zoom_out')
        const fullscreen = this.add.sprite(0, 0, 'button/fullscreen')

        zoomIn.setInteractive()
        zoomOut.setInteractive()
        fullscreen.setInteractive()

        const gameScene = GameScene.Instance

        zoomIn.on('pointerdown', () => gameScene.zoom.more())
        zoomOut.on('pointerdown', () => gameScene.zoom.less())
        fullscreen.on('pointerdown', this.goFullscreen.bind(this))

        const updateButtonsPosition = () => {
            const x = 30//this.game.scale.gameSize.width - 35

            const y = 200
            const o = 55

            zoomIn.setPosition(x, y + o)
            zoomOut.setPosition(x, y + o*2)
            fullscreen.setPosition(x, y + o*3)
        }

        this.events.on("resize", () => updateButtonsPosition())

        updateButtonsPosition()
    }

    private goFullscreen() {
        if (this.game.scale.isFullscreen) {
            this.game.scale.stopFullscreen();
            return;
        }
        this.game.scale.startFullscreen({})
    }
}