import Inventory from "./Inventory";

export default class InventoryManager {
    public createInventory(id: string, slots: number)
    {
        var inventory = new Inventory()
        
        for (let i = 0; i < slots; i++) {
            inventory.createSlot()
            
        }


        return inventory
    }
}