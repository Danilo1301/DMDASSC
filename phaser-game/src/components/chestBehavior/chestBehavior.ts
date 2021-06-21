import { Input } from "@phaserGame/input";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { MovementComponent, PhysicBodyComponent } from "@phaserGame/components";
import { PositionComponent } from "../position";
import { SpriteComponent } from "../sprite";
import { Network } from "@phaserGame/network";

export class ChestBehaviorComponent extends Component {
    public Entity!: WorldEntity

    public Awake(): void {
        super.Awake()

        this.Entity.GetComponent(SpriteComponent).Events.on("pointerdown", () => {

            console.log("I NEED TO OPEN")

            this.CallComponentFunction("REQUEST_OPEN_CHEST")

            
        })

        //Network.Events.on()
    }

    public OnReceiveComponentFunction(key: string, id?: string) {
        console.log(key)

        if(key == 'REQUEST_OPEN_CHEST') {
            if(id) {
                console.log("POPULATE")
            }

            console.log("YES YOU CAN OPEN")

            this.CallComponentFunction("OPEN_CHEST", id)

            
        }

        if(key == 'OPEN_CHEST') {
            console.log("NOW ILL OPEN THIS MDKC SHIEET")

            alert("Lets pretend you opened the chest /o")
        }
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