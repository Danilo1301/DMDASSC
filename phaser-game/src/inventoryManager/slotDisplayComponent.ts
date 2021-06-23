import { Component } from "@phaserGame/utils"
import { Item } from "./item"
import { Slot } from "./slot"

export class SlotItemDisplayComponent extends Component
{
    public _item: Item

    public _sprite?: Phaser.GameObjects.Sprite
    
    public _text?: Phaser.GameObjects.Text

    constructor(item: Item)
    {
        super()

        this._item = item
    }

    public get Slot(): Slot
    {
        return this.Entity as Slot
    }

    public Awake(): void
    {
        super.Awake()

        this._sprite = this.Slot._scene.add.sprite(this.Slot._position.x, this.Slot._position.y, this._item.Texture)
        this._text = this.Slot._scene.add.text(this.Slot._position.x, this.Slot._position.y, this._item.Name)
    }

    public Destroy(): void
    {
        super.Destroy()

        this._sprite?.destroy()
        this._text?.destroy()
    }
}