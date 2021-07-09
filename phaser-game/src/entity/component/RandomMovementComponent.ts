import Component from "./Component"
import MovementComponent from "./MovementComponent"
import PositionComponent from "./PositionComponent"

export class RandomMovementComponent extends Component {
    private _lastMoved = 5000

    private _targetPos = { x: 0, y: 0 }

    public update(delta: number): void {
        super.update(delta)

        this._lastMoved += delta

        if(this._lastMoved >= 4000) {
            this._lastMoved = 0

            this._targetPos.x = Math.random()*900
            this._targetPos.y = Math.random()*600
        }

        var entity = this.getEntity()
        
        var movementComponent = entity.getComponent(MovementComponent)
        movementComponent.horizontal = 0
        movementComponent.vertical = 0

        var positionComponent = entity.getComponent(PositionComponent)
        var currentPosition = {x: positionComponent.x, y: positionComponent.y}

        if(currentPosition.x > this._targetPos.x) movementComponent.horizontal = -1
        if(currentPosition.x < this._targetPos.x) movementComponent.horizontal = 1

        if(currentPosition.y > this._targetPos.y) movementComponent.vertical = -1
        if(currentPosition.y < this._targetPos.y) movementComponent.vertical = 1

        if(Phaser.Math.Distance.BetweenPoints(currentPosition, this._targetPos) < 20) {
            movementComponent.horizontal = 0
            movementComponent.vertical = 0
        }
    }
}