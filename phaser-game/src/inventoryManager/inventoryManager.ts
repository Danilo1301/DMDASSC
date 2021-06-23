import { InventoryComponent } from "@phaserGame/components"
import { GameClient } from "@phaserGame/game"
import { InventoryWindow } from "./inventoryWindow"
import { Slot } from "./slot"

export class SlotMoveManager 
{
    public static _slot?: Slot

    public static StartMoveSlot(slot: Slot)
    {
        if(!this._slot)
        {
            this._slot = slot

            console.log("Start moving ", slot)
        }
    
    }

    public static IsMovingSlot()
    {
        return this._slot != undefined
    }

    public static DropItemInSlot(slot: Slot)
    {
        console.log("drop in", slot)


        var fromSlot = this._slot!
        var toSlolt = slot


        toSlolt._inventoryWindow._inventoryComponent.RequestMoveItem(
            fromSlot._inventoryWindow._inventoryComponent.Entity.Id,
            fromSlot._index,
            toSlolt._inventoryWindow._inventoryComponent.Entity.Id,
            toSlolt._index
        )

        this._slot = undefined
    }
}

export class InventoryManager {
    public static Game: GameClient

    private static _inventoryWindows = new Phaser.Structs.Map<string, InventoryWindow>([])

    

    public static Setup(game: GameClient)
    {
        this.Game = game
    }

    public static CreateInventoryWindow(inventoryComponent: InventoryComponent)
    {
        var entityId = inventoryComponent.Entity.Id
        var inventoryId = "InventoryWindow" + entityId

        if(this._inventoryWindows.has(inventoryId))
        {
            console.log(`[InventoryManager] Window '${inventoryId}' already created!`)
            return
        }

        console.log(`[InventoryManager] Create Window '${inventoryId}'`)

        console.log(this.Game.PhaserGame.scene)

        console.log(inventoryId)

        var scene = this.Game.PhaserGame.scene.add(inventoryId, {}, true)

        console.log(scene)

        var inventoryWindow = new InventoryWindow(inventoryId, scene, inventoryComponent)

        this._inventoryWindows.set(inventoryId, inventoryWindow)

        return inventoryWindow
    }

    public static CloseInventoryWindow(inventoryComponent: InventoryComponent)
    {
        var entityId = inventoryComponent.Entity.Id
        var inventoryId = "InventoryWindow" + entityId

 
        var inventoryWindow = this._inventoryWindows.get(inventoryId)

        if(!inventoryWindow) return

        inventoryWindow.Close()

        this._inventoryWindows.delete(inventoryId)

        this.Game.PhaserGame.scene.remove(inventoryId)
    }
}