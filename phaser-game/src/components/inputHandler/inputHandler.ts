import { Input } from "@phaserGame/input";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { MovementComponent } from "@phaserGame/components";

export class InputHandlerComponent extends Component
{
    public Entity!: WorldEntity

    public ControlledByPlayer: boolean = false

    public Update(delta: number): void
    {
        super.Update(delta)

        if(!this.ControlledByPlayer) return

        var entity = this.Entity
        var movementComponent = entity.GetComponent(MovementComponent)

        if(!movementComponent) return

        movementComponent.Horizontal = Input.Horizontal
        movementComponent.Vertical = Input.Vertical
    }
}