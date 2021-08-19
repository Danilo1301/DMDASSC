export class FPSCounter
{
    private static _instances: FPSCounter[] = []

    public static addToScene(scene: Phaser.Scene)
    {
        const fpsCounter = new FPSCounter(scene)

        this._instances.push(fpsCounter)
    }

    public static destroyAllInstances()
    {
        this._instances.map(fpsCounter => fpsCounter.destroy())
        this._instances = []
    }

    private _scene: Phaser.Scene

    private _container: Phaser.GameObjects.Container

    private _graphics: Phaser.GameObjects.Graphics

    private _text: Phaser.GameObjects.Text

    private _changeTextTime: number = 0

    private _updateFn: (time: number, delta: number) => void

    private constructor(scene: Phaser.Scene)
    {
        this._scene = scene

        const w = 80
        const h = 20

        const container = this._container = scene.add.container()

        const graphics = this._graphics = scene.add.graphics()
        graphics.fillStyle(0xffffff)
        graphics.fillRect(0, 0, w, h)
 
        
        const text = this._text = scene.add.text(0, 0, `0 FPS`, {color: 'black'})
        text.setOrigin(0, 0.5)
        text.setPosition(5, h/2)

        container.add([graphics, text])
        container.setPosition(5, 5)
     
        this._updateFn = this.update.bind(this)

        scene.events.on("update", this._updateFn)

        
    }

    private update(time: number, delta: number)
    {
        this._changeTextTime += delta

        if(this._changeTextTime >= 700)
        {
            this._changeTextTime = 0

            this._text.setText(`${Math.round(this._scene.game.loop.actualFps)} FPS`)
        }

    }

    public destroy()
    {
        this._scene.events.removeListener('update', this._updateFn)
        this._text.destroy()
        this._graphics.destroy()
        this._container.destroy()
    }
}