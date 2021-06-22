import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PositionComponent } from "../position";

class Slot
{
    public Index: number = -1
    public ItemId?: string
}

export class InventoryComponent extends Component
{
    public Entity!: WorldEntity

    public _slots: Slot[] = []

    public Awake(): void
    {
        super.Awake()

        this.AddSlot()
        this.AddSlot()
        this.AddSlot()

        console.log(this._slots)

        this.ShowSlots()
    }

    public AddSlot()
    {
        var slot = new Slot()

        this._slots.push(slot)

        slot.Index = this._slots.indexOf(slot)

        return slot
    }

    public SetSlotItem(index: number, itemId: string)
    {
        this._slots[index].ItemId = itemId

        console.log(this._slots)
    }

    public OnReceiveFunction(key: string, data: object)
    {
        console.log("INVENTORY", key, data)

        if(key == 'SET_SLOTS') {
            this._slots = data['slots']

            this.ShowSlots()
        }
    }

    public ShowSlots() {
        var str = ""

        for (const slot of this._slots) {
            str += `[${slot.Index}] ${slot.ItemId || "Empty"}\n`   
        }

        var position = this.Entity.GetComponent(PositionComponent)

        var text = this.Entity.World.Scene.add.text(position.X, position.Y - 70, str)

  
        setTimeout(() => {
            text.destroy()
        }, 1000)
    }
}