const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    transparent: false,
    backgroundColor: 0x000,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.NONE,
        //autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 900,
        height: 600
    },
    physics: {
        default: 'matter',
        matter: {
            debug: {
                showBounds: false,
                showBody: true, //true
                showAxes: false,
                showPositions: false,
                showVelocity: true, //true
                showCollisions: false,
                showAngleIndicator: true //true
            },
            gravity: {
                x: 0,
                y: 0
            }
        }
    },  
    scene: {}
}

export default class SceneManager
{
    private static _phaserInstances: Phaser.Game[] = []

    private static _headless: boolean = false

    public static async createPhaserInstance(): Promise<Phaser.Game>
    {
        return new Promise((resolve) =>
        {
            if(this._headless) config.type = Phaser.HEADLESS
            else config.type = Phaser.WEBGL

            var phaser = new Phaser.Game(config)

            this._phaserInstances.push(phaser)

            if(this.isHeadless && this._phaserInstances.length >= 1)
            {
                resolve(phaser)
                return
            }

            phaser.events.on("ready", () => resolve(phaser))
        })
    }

    public static get isHeadless(): boolean
    {
        return this._headless
    }

    public static setHeadless(isHeadless: boolean): void
    {
        this._headless = isHeadless
    }

    public static getGame(): Phaser.Game
    {
        return this._phaserInstances[0]
    }

    public static getScene(): Phaser.Scene
    {
        return this.getSceneOfGame(this.getGame())
    }

    public static getSceneOfGame(game: Phaser.Game): Phaser.Scene
    {
        return game.scene.getAt(0)!
    }
}