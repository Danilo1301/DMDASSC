import { InventoryComponent } from "@phaserGame/components"
import { Slot } from "./slot"

export class InventoryWindow
{
    private _slots: Slot[] = []

    private _scene: Phaser.Scene

    public _inventoryComponent: InventoryComponent

    private _id: string

    constructor(id: string, scene: Phaser.Scene, inventoryComponent: InventoryComponent)
    {
        this._id = id
        this._scene = scene
        this._inventoryComponent = inventoryComponent

        this._scene.cameras.main.setSize(300, 300)

        
        //
        this.CreateSlot(150 + -55, 55)
        this.CreateSlot(150 + 0, 55)
        this.CreateSlot(150 + 55, 55)
        //

        

        this.UpdateVisuals()

        inventoryComponent.Events.on("slots_updated", this.UpdateVisuals, this)

        setInterval(this.Update.bind(this), 1)
    }

    public UpdateVisuals()
    {
        for (const slotData of this._inventoryComponent._slots) {

            var slot = this.GetSlot(slotData.Index)

            slot.SetItem(undefined)

            if(slotData.Item)
            {
                slot.SetItem(slotData.Item)
            }
        }
    }

    public Update()
    {
        for (const slot of this._slots) slot.Update()
    }

    public CreateSlot(x: number, y: number): Slot
    {
        var slot = new Slot(this._scene, this, x, y)

        slot.Awake()
        slot.Start()

        this._slots.push(slot)

        slot._index = this._slots.indexOf(slot)

        console.log(`[InventoryWindow] Create slot`)

        return slot
    }

    public GetSlot(index: number)
    {
        return this._slots[index]
    }
}