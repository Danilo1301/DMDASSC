import { InventoryManager } from "@phaserGame/inventoryManager/inventoryManager";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { InventoryComponent } from "../inventory";
import { SpriteComponent } from "../sprite";

export class ChestBehaviorComponent extends Component
{
    public Entity!: WorldEntity

    public Awake(): void
    {
        super.Awake()

        this.Entity.GetComponent(SpriteComponent).Events.on("pointerdown", () =>
        {
            console.log("I NEED TO OPEN")

            this.CallFunction("REQUEST_OPEN_CHEST", {}) 
        })
    }

    

    public OnReceiveFunction(key: string, data: any)
    {
        console.log(key)

        if(key == 'REQUEST_OPEN_CHEST')
        {
            console.log("YES YOU CAN OPEN")

            if(data['id'])
            {
                var intentoryComponent = this.Entity.GetComponent(InventoryComponent)


                if(!intentoryComponent._clientsUsingInventory.includes(data.id))
                {
                    console.log(`Client ${data.id} is now listening for ccrate`)
                    intentoryComponent._clientsUsingInventory.push(data.id)
                }
                
                
                intentoryComponent.BroadcastItemsToAllClients()
            }


            this.CallFunction("OPEN_CHEST", {id: data['id']})

   
        }

        if(key == 'OPEN_CHEST')
        {
            console.log("NOW ILL OPEN THIS MDKC SHIEET")

            var intentoryComponent = this.Entity.GetComponent(InventoryComponent)

            var inventoryWindow = InventoryManager.CreateInventoryWindow(this.Entity.Id, intentoryComponent)
        }
    }
}