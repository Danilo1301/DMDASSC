class Item
{
    private _position = new Phaser.Math.Vector2()
    private _targetPosition = new Phaser.Math.Vector2()

    private _container: Phaser.GameObjects.Container
    private _text: Phaser.GameObjects.BitmapText
    private _graphics: Phaser.GameObjects.Graphics

    private _lifeTime: number = 0

    public get canDestroy()
    {
        return this._lifeTime >= 5000
    }

    constructor(scene: Phaser.Scene, text: string)
    {
        const container = this._container = scene.add.container()

        const textObj = this._text = scene.add.bitmapText(0, 0, 'gem', text, 11).setTint(0)
        textObj.setOrigin(0.5, 0.5)
        textObj.setPosition(200/2, 25/2)

        const graphics = this._graphics = scene.add.graphics()
        graphics.fillStyle(0xffffff)
        graphics.fillRect(0, 0, 200, 25)

        container.add([graphics, textObj])
    }

    public setPosition(position: Phaser.Math.Vector2, dontLerp?: boolean)
    {
        this._targetPosition.set(position.x, position.y)

        if(dontLerp) this._position.set(position.x, position.y)
    }

    public update(delta: number)
    {

        const speed = 0.01

        this._position = new Phaser.Math.Vector2(
            Phaser.Math.Linear(this._position.x, this._targetPosition.x, speed * delta),
            Phaser.Math.Linear(this._position.y, this._targetPosition.y, speed * delta)
        )

        this._container.setPosition(this._position.x, this._position.y)

        this._lifeTime += delta
    }

    public destroy()
    {
        this._container.destroy()
        this._text.destroy()
        this._graphics.destroy()
    }
}

export class NotificationBar
{
    private _items: Item[] = []
    private _scene: Phaser.Scene

    constructor(scene: Phaser.Scene)
    {
        this._scene = scene

        scene.events.on("update", this.update.bind(this))
    }

    public addItem(text: string)
    {
        const item = new Item(this._scene, text)

        item.setPosition(new Phaser.Math.Vector2(this._scene.game.scale.gameSize.width, this._items.length * 30), true)

        this._items.push(item)
    }

    private update(time: number, delta: number)
    {
        const toDestroy = this._items.filter(item => item.canDestroy)

        toDestroy.map(item => {
            this._items.splice(this._items.indexOf(item), 1)
            item.destroy()
        })

        this._items.map((item, index) => {

            item.setPosition(new Phaser.Math.Vector2(this._scene.game.scale.gameSize.width - 200, index * 30))

            item.update(delta)
        })


    }
}