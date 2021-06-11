import { PacketEntityInfo } from "@phaserGame/server/packets"
import { Entity, IComponent } from "@phaserGame/utils"
import { PhysicBody } from "../physicBody"
import { Position } from "../position"

export class SyncHelper implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    public Enabled: boolean = true

    public Data?: PacketEntityInfo

    public Awake(): void {
        
    }

    public Update(deltaTime: number): void {
        var data = this.Data

        if(!data) return
        
        var lerp = Phaser.Math.Interpolation.Bezier

        var position = this.Entity!.GetComponent(Position)
        var physicBody = this.Entity!.GetComponent(PhysicBody)

        var thisVelocity = physicBody.Body!.velocity;

        var newVelocity = {
            x: lerp([thisVelocity.x, data.Velocity.X], 0.4),
            y: lerp([thisVelocity.y, data.Velocity.Y], 0.4)
        }

        physicBody.SetVelocity(newVelocity.x, newVelocity.y)

        var newPosition = {
            x: lerp([position.X, data.Position.X], 0.4),
            y: lerp([position.Y, data.Position.Y], 0.4)
        }

        position.Set(newPosition.x, newPosition.y)

        var distance = Phaser.Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: data.Position.X, y: data.Position.Y})

        

        //entityPosition.Set(newPosition.x, newPosition.y)




        if(distance > 30) {
            position.Set(data.Position.X, data.Position.Y)
        }
    }

    public Destroy(): void {
        
    }

}