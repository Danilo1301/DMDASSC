import { InventoryComponent } from "@phaserGame/components"
import { GameClient } from "@phaserGame/game"
import { InventoryWindow } from "./inventoryWindow"

export class InventoryManager {
    public static Game: GameClient

    private static _inventoryWindows = new Phaser.Structs.Map<string, InventoryWindow>([])

    public static Setup(game: GameClient)
    {
        this.Game = game
    }

    public static CreateInventoryWindow(id: string, inventoryComponent: InventoryComponent)
    {
        var inventoryId = "InventoryWindow" + id

        if(this._inventoryWindows.has(inventoryId))
        {
            console.log(`[InventoryManager] Window '${inventoryId}' already created!`)
            return
        }

        console.log(`[InventoryManager] Create Window '${inventoryId}'`)

        var scene = this.Game.PhaserGame.scene.add(inventoryId, {}, true)

        var inventoryWindow = new InventoryWindow(id, scene, inventoryComponent)

        this._inventoryWindows.set(inventoryId, inventoryWindow)

        return inventoryWindow
    }
}