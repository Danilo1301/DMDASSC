import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PhysicBodyComponent } from "@phaserGame/components";

export class MovementComponent extends Component
{
    public Entity!: WorldEntity

    public Speed: number = 0.01

    public Horizontal: number = 0

    public Vertical: number = 0

    public Update(delta: number): void
    {
        super.Update(delta)

        var entity = this.Entity
        var physicBodyComponent = entity.GetComponent(PhysicBodyComponent)
        var matter = entity.World.Scene.matter

        var speed = this.Speed
        var directional = false

        var horizontal = this.Horizontal
        var vertical = this.Vertical
        
        var body = physicBodyComponent.DefaultBody

        var force = {x: 0, y: 0}

        if(body)
        {
            if(directional)
            {
                var direction = body.angle

                force.x = Math.cos(direction) * speed
                force.y = Math.sin(direction) * speed
            }
            else
            {
                force.x = horizontal * speed
                force.y = vertical * speed
            }

            matter.applyForce(body, {x: force.x * delta, y: force.y * delta})
        }
    }
}