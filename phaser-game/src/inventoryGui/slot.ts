import { Component, Entity } from "@phaserGame/utils";
import { InventoryWindow } from "./inventoryGui";
import { Item } from "./item";

export class SlotItemDisplayComponent extends Component {

    public _item: Item

    public _sprite?: Phaser.GameObjects.Sprite
    public _text?: Phaser.GameObjects.Text

    constructor(item: Item)
    {
        super()

        this._item = item
    }

    public get Slot(): Slot {
        return this.Entity as Slot
    }

    public Awake(): void
    {
        super.Awake()

     
        this._sprite = this.Slot._scene.add.sprite(this.Slot._position.x, this.Slot._position.y, this._item.Texture)
        this._text = this.Slot._scene.add.text(this.Slot._position.x, this.Slot._position.y, this._item.Name)
        
          

    }

    public Destroy(): void {
        super.Destroy()

        this._sprite?.destroy()
        this._text?.destroy()
    }
}

export class Slot extends Entity
{
    public _scene: Phaser.Scene

    public _position = {
        x: 0,
        y: 0
    }

    public _inventoryWindow: InventoryWindow

    constructor(scene: Phaser.Scene, inventoryWindow: InventoryWindow, x: number, y: number)
    {
        super()

        this._scene = scene
        this._inventoryWindow = inventoryWindow

        this._position.x = x
        this._position.y = y
    }

    public Awake(): void
    {
        super.Awake()

        var sprite = this._scene.add.rectangle(this._position.x, this._position.y, 50, 50, 0x686868)

        



        sprite.setInteractive()

        var slot = this

        sprite.on("pointerdown", () => {
            console.log("DOWN")

            if(slot.HasComponent(SlotItemDisplayComponent))
            {
                var c = slot.GetComponent(SlotItemDisplayComponent)

                console.log(c._item)

                this._inventoryWindow._inventoryComponent.MoveSlot(1, 0)

                this._inventoryWindow.UpdateVisuals()
            }
        })

        sprite.on("pointerup", () => {
            console.log("UP")
        })
    }

    public Update(): void
    {
        super.Update(0)
    }

    public SetItem(item: Item | undefined)
    {
        if(this.HasComponent(SlotItemDisplayComponent))
        {
            this.RemoveComponent(SlotItemDisplayComponent)

            console.log(this, 'remove')
        }

        if(item)
            this.AddComponent(new SlotItemDisplayComponent(item))
    }
}