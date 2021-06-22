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

    public OnReceiveFunction(key: string, data: object)
    {
        console.log(key)

        if(key == 'REQUEST_OPEN_CHEST')
        {
            if(data['id'])
            {
                var intentoryComponent = this.Entity.GetComponent(InventoryComponent)

                

                intentoryComponent.CallFunction("SET_SLOTS", {id: data['id'], slots: intentoryComponent._slots})

                console.log("POPULATE")
            }

            console.log("YES YOU CAN OPEN")

            this.CallFunction("OPEN_CHEST", {id: data['id']})
        }

        if(key == 'OPEN_CHEST')
        {
            console.log("NOW ILL OPEN THIS MDKC SHIEET")

            //alert("Lets pretend you opened the chest \\o/")
        }
    }
}