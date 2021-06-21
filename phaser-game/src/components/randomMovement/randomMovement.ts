import { Input } from "@phaserGame/input";
import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { MovementComponent, PhysicBodyComponent } from "@phaserGame/components";
import { PositionComponent } from "../position";

export class RandomMovementComponent extends Component {
    public Entity!: WorldEntity

    private _lastMoved = 5000
    private _targetPos = {
        x: 0,
        y: 0
    }

    public Awake(): void {
        super.Awake()
    }

    public Start(): void {
        super.Start()
    }

    public Update(delta: number): void {
        super.Update(delta)

        this._lastMoved += delta

        if(this._lastMoved >= 4000) {
            this._lastMoved = 0

            this._targetPos.x = Math.random()*900 - 900/2
            this._targetPos.y = Math.random()*600 - 600/2
        }

        
        var movementComponent = this.Entity.GetComponent(MovementComponent)
        movementComponent.Horizontal = 0
        movementComponent.Vertical = 0

        var positionComponent = this.Entity.GetComponent(PositionComponent)
        var currentPosition = {x: positionComponent.X, y: positionComponent.Y}

        if(currentPosition.x > this._targetPos.x) movementComponent.Horizontal = -1
        if(currentPosition.x < this._targetPos.x) movementComponent.Horizontal = 1

        if(currentPosition.y > this._targetPos.y) movementComponent.Vertical = -1
        if(currentPosition.y < this._targetPos.y) movementComponent.Vertical = 1

        if(Phaser.Math.Distance.BetweenPoints(currentPosition, this._targetPos) < 5) {
            movementComponent.Horizontal = 0
            movementComponent.Vertical = 0
        }
    }

    public Destroy() {
        super.Destroy()
    }
}