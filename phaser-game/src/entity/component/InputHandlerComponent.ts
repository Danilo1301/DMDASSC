import Component from "./Component"
import MovementComponent from "./MovementComponent"

export class InputHandlerComponent extends Component
{
    private _isControlledByPlayer: boolean = false

    public update(delta: number): void
    {
        super.update(delta)

        if(!this._isControlledByPlayer) return

        var entity = this.getEntity()
        var movementComponent = entity.getComponent(MovementComponent)

        if(!movementComponent) return

        var inputManager = entity.getWorld().getServer().getGame().getInputManager()

        movementComponent.horizontal = inputManager.getHorizontal()
        movementComponent.vertical = inputManager.getVertical()
    }

    public setControlledByPlayer(value: boolean) {
        this._isControlledByPlayer = value
    }
}