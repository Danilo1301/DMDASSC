import { PacketEntityInfo } from "@phaserGame/server/packets"
import { Entity, IComponent } from "@phaserGame/utils"
import { PhysicBody } from "../physicBody"
import { Position } from "../position"

export class SyncHelper implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    public Enabled: boolean = true

    private Data?: PacketEntityInfo

    public ForceEntityFallback: boolean = false

    public LastNormalPosition = {
        x: 0,
        y: 0
    }

    private _lastDistance: number = 0
    private _lastMovementNeeded: number = 0

    constructor(forceEntityFallback?: boolean) {
        this.ForceEntityFallback = forceEntityFallback !== undefined ? forceEntityFallback : false
    }

    public Awake(): void {
        
    }

    public SetData(data: PacketEntityInfo) {
        this.Data = data
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

        var lerpamount = 0.1

        var newPosition = {
            x: lerp([position.X, data.Position.X], lerpamount),
            y: lerp([position.Y, data.Position.Y], lerpamount)
        }

        

        var distance = Phaser.Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: data.Position.X, y: data.Position.Y})

        var movementNeeded = Math.abs(Math.abs(position.X) - Math.abs(newPosition.x)) + Math.abs(Math.abs(position.Y) - Math.abs(newPosition.y))

        var distanceMoved = Math.abs(distance - this._lastDistance)

        if(distance > 5 && this.ForceEntityFallback) {
            //console.log(distance, movementNeeded, distanceMoved, distanceMoved/movementNeeded)

            if(distanceMoved/movementNeeded < movementNeeded * lerpamount * 0.5) {

                position.Set(this.LastNormalPosition.x, this.LastNormalPosition.y)

            }
        }

        this._lastMovementNeeded = movementNeeded
        this._lastDistance = distance

        position.Set(newPosition.x, newPosition.y, false)

        var distance = Phaser.Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: data.Position.X, y: data.Position.Y})

        

        //entityPosition.Set(newPosition.x, newPosition.y)

        if(distance > 5) {
            
        } else {
            this.LastNormalPosition.x = position.X
            this.LastNormalPosition.y = position.Y
        }


        if(distance > 20 && !this.ForceEntityFallback) {
            position.Set(data.Position.X, data.Position.Y)
        }
    }

    public Destroy(): void {
        
    }

}