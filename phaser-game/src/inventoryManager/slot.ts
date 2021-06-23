import { Component, Entity } from "@phaserGame/utils";
import { InventoryWindow } from "./inventoryWindow";
import { Item } from "./item";
import { SlotItemDisplayComponent } from "./slotDisplayComponent";

export class Slot extends Entity
{
    public _scene: Phaser.Scene

    public _position = {
        x: 0,
        y: 0
    }

    public _inventoryWindow: InventoryWindow

    public _index: number = 0

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

                var newslot = slot._index

                while(newslot == slot._index)
                {
                    newslot = Math.round(Math.random()*2)
                }

                this._inventoryWindow._inventoryComponent.MoveSlot(slot._index, newslot)

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