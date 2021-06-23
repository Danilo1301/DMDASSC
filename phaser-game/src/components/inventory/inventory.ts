import { Item } from "@phaserGame/inventoryManager/item";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PositionComponent } from "../position";

class Slot
{
    public Index: number = -1
    public Item?: Item
}

export class InventoryComponent extends Component
{
    public Entity!: WorldEntity

    public _slots: Slot[] = []

    public Events = new Phaser.Events.EventEmitter();

    public _clientsUsingInventory: string[] = []

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

    public SetSlotItem(index: number, item: Item)
    {
        this._slots[index].Item = item

        console.log(this._slots)
    }

    public MoveSlot(indexFrom: number, indexTo: number)
    {
        this.CallFunction("REQUEST_MOVE_ITEM", {
            from: indexFrom,
            to: indexTo
        }) 

        //this.PerformMoveAction

    }

    public BroadcastItemsToAllClients()
    {
        for (const clientId of this._clientsUsingInventory) {
            this.CallFunction("SET_SLOTS", {id: clientId, slots: this._slots})
        }
    }

    public PerformMoveAction(from: any, to: any)
    {
        console.log(from, to)

        var fromInventory = this.Entity.World.EntityFactory.GetEntity(from.id).GetComponent(InventoryComponent)
        var toInventory = this.Entity.World.EntityFactory.GetEntity(to.id).GetComponent(InventoryComponent)

        console.log(fromInventory, toInventory)

        var slotFrom = fromInventory._slots[from.index]
        var slotTo = toInventory._slots[to.index]

        var itemOnSlotFrom = slotFrom.Item
        var itemOnSlotTo = slotTo.Item
 
        
        if(itemOnSlotFrom)
        {
            slotTo.Item = itemOnSlotFrom
            slotFrom.Item = undefined

            if(itemOnSlotTo)
            {
                slotFrom.Item = itemOnSlotTo
            }

            
        }

        

        fromInventory.Events.emit("slots_updated")
        toInventory.Events.emit("slots_updated")

        fromInventory.BroadcastItemsToAllClients()
        toInventory.BroadcastItemsToAllClients()
    }

    public RequestMoveItem(fromId, fromIndex, toId, toIndex)
    {
        this.CallFunction("REQUEST_MOVE_ITEM", {
            from: {id: fromId, index: fromIndex},
            to: {id: toId, index: toIndex}
        })
    }

    public OnReceiveFunction(key: string, data: any)
    {
        console.log("INVENTORY", key, data)

        if(key == 'SET_SLOTS') {
            this._slots = data['slots']

            this.Events.emit("slots_updated")

            this.ShowSlots()
        }

        if(key == 'REQUEST_MOVE_ITEM')
        {
            
            console.log("he wants to move")

            this.PerformMoveAction(data.from, data.to)
        }
    }

    public ShowSlots() {
        var str = ""

        for (const slot of this._slots) {
            str += `[${slot.Index}] ${slot.Item?.Id || "Empty"}\n`   
        }

        var position = this.Entity.GetComponent(PositionComponent)

        var text = this.Entity.World.Scene.add.text(position.X, position.Y - 70, str)

  
        setTimeout(() => {
            text.destroy()
        }, 1000)

        
    }
}