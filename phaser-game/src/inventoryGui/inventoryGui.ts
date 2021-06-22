import { InventoryComponent } from "@phaserGame/components"
import { GameClient } from "@phaserGame/game"
import { ItemManager } from "./item"
import { Slot, SlotItemDisplayComponent } from "./slot"

export class InventoryWindow
{
    private _slots: Slot[] = []

    private _scene: Phaser.Scene

    public _inventoryComponent: InventoryComponent

    constructor(scene: Phaser.Scene, inventoryComponent: InventoryComponent)
    {
        this._scene = scene
        this._inventoryComponent = inventoryComponent

        //this._scene.add.rectangle(150, 150, 300, 300, 0x3D3D3D)

        this._scene.cameras.main.setSize(300, 300)

        setInterval(this.Update.bind(this), 1)

        this.CreateSlot(150 + -55, 55)
        this.CreateSlot(150 + 0, 55)
        this.CreateSlot(150 + 55, 55)

        this.UpdateVisuals()

        inventoryComponent.Events.on("slots_updated", this.UpdateVisuals, this)
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

        console.log(`[InventoryWindow] Create slot`)

        return slot
    }

    public GetSlot(index: number)
    {
        return this._slots[index]
    }
}

export class InventoryGui {
    public static Game: GameClient

    public static Setup(game: GameClient)
    {
        this.Game = game
    }

    public static CreateInventoryWindow(inventoryComponent: InventoryComponent)
    {
        var scene = this.Game.PhaserGame.scene.add("InventoryWindow0", {}, true)

        var inventoryWindow = new InventoryWindow(scene, inventoryComponent)

        return inventoryWindow
    }
}