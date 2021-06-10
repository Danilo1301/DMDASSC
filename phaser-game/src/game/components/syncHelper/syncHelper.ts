import { Entity, IComponent } from "@phaserGame/utils"
import { Position } from "../position"

export class SyncHelper implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    public Enabled: boolean = true

    public Position = {
        X: 0,
        Y: 0
    }

    public Awake(): void {
        
    }

    public Update(deltaTime: number): void {
        var lerp = Phaser.Math.Interpolation.Bezier

        var entityPosition = this.Entity!.GetComponent(Position)

        var newPosition = {
            x: lerp([entityPosition.X, this.Position.X], 0.4),
            y: lerp([entityPosition.Y, this.Position.Y], 0.4)
        }

        var distance = Phaser.Math.Distance.BetweenPoints({x: entityPosition.X, y: entityPosition.Y}, {x: this.Position.X, y: this.Position.Y})

        entityPosition.Set(newPosition.x, newPosition.y)

        if(distance > 100) {
            entityPosition.Set(this.Position.X, this.Position.Y)
        }
    }

    public Destroy(): void {
        
    }

}