class Item
{
    private _position = new Phaser.Math.Vector2()
    private _targetPosition = new Phaser.Math.Vector2()

    private _container: Phaser.GameObjects.Container
    private _text: Phaser.GameObjects.BitmapText
    private _graphics: Phaser.GameObjects.Graphics

    private _lifeTime: number = 0

    public width: number = 300
    public height: number = 0

    public get canDestroy()
    {
        return this._lifeTime >= 5000
    }

    constructor(scene: Phaser.Scene, textContent: string, textColor?: number, backgroundColor?: number)
    {
        const maxWidth = this.width
        const minHeight = 20

        const container = this._container = scene.add.container()
        const graphics = this._graphics = scene.add.graphics()

        container.add(graphics)

        const text = this._text = scene.add.bitmapText(100, 100, 'gem', '', 12, Phaser.GameObjects.BitmapText.ALIGN_CENTER)
        text.setTint(textColor || 0)
        text.setMaxWidth(maxWidth)
        text.setText(textContent)
        text.setFontSize(14)

        container.add(text)

        const bounds = text.getTextBounds()
        const height = this.height = Math.max(minHeight, bounds.global.height)

        text.setPosition(maxWidth/2, height/2)
        text.setOrigin(0.5)
        
        graphics.fillStyle(backgroundColor || 0xffffff, 0.5)
        graphics.fillRect(0, 0, maxWidth, height)
        

        //container.setPosition(position.x, position.y)

        this.setVisible(false)
    }

    public setVisible(value: boolean)
    {
        this._text.setAlpha(value ? 1 : 0)
        this._graphics.setAlpha(value ? 1 : 0)
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

    public addItem(text: string, textColor?: number, backgroundColor?: number)
    {
        const item = new Item(this._scene, text, textColor, backgroundColor)

        this._items.push(item)

        item.setPosition(new Phaser.Math.Vector2(this.getX(), this.getHeight(item)), true)
        item.setVisible(true)
    }

    private getX()
    {
        return this._scene.game.scale.gameSize.width
    }

    private getHeight(item: Item)
    {
        let h = 0

        for (const it of this._items)
        {
            if(it == item) break
            
            h += item.height + 3
        }

        return h
    }

    private update(time: number, delta: number)
    {
        const toDestroy = this._items.filter(item => item.canDestroy)

        toDestroy.map(item =>
        {
            this._items.splice(this._items.indexOf(item), 1)
            item.destroy()
        })

   
        this._items.map((item, index) =>
        {
            item.setPosition(new Phaser.Math.Vector2(this.getX() - item.width, this.getHeight(item)))
            item.update(delta)

        })
    }
}