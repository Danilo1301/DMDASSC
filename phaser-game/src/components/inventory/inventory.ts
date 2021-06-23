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

    public PerformMoveAction(indexFrom: number, indexTo: number)
    {
        console.log(indexFrom, indexTo)


        var itemOnSlotFrom = this._slots[indexFrom].Item
        var itemOnSlotTo = this._slots[indexTo].Item
        
        if(itemOnSlotFrom)
        {


            

            this._slots[indexTo].Item = itemOnSlotFrom
            this._slots[indexFrom].Item = undefined

            if(itemOnSlotTo)
            {
                this._slots[indexFrom].Item = itemOnSlotTo
            }

            
        }

        

        this.Events.emit("slots_updated")
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

            var intentoryComponent = this.Entity.GetComponent(InventoryComponent)
            intentoryComponent.BroadcastItemsToAllClients()
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