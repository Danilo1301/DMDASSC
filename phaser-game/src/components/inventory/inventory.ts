import { Input } from "@phaserGame/input";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { MovementComponent, PhysicBodyComponent } from "@phaserGame/components";
import { PositionComponent } from "../position";

class Slot {
    public Index: number = -1
    public ItemId?: string
}

export class InventoryComponent extends Component {
    public Entity!: WorldEntity

    public _slots: Slot[] = []

    public Awake(): void {
        super.Awake()

        this.AddSlot()
        this.AddSlot()
        this.AddSlot()

        console.log(this._slots)
    }

    public AddSlot() {
        var slot = new Slot()

        this._slots.push(slot)

        slot.Index = this._slots.indexOf(slot)

        return slot
    }

    public SetSlotItem(index: number, itemId: string) {
        this._slots[index].ItemId = itemId

        console.log(this._slots)
    }

    public Start(): void {
        super.Start()
    }

    public Update(delta: number): void {
        super.Update(delta)
    }

    public Destroy() {
        super.Destroy()
    }
}