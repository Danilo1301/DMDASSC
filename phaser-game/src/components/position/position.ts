import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PhysicBodyComponent } from "@phaserGame/components";

interface PositionComponentData {
    x?: number
    y?: number
}

export class PositionComponent extends Component {
    public Entity!: WorldEntity

    private _targetx: number = 0
    private _targety: number = 0

    private _x: number = 0
    private _y: number = 0

    constructor() {
        super()

        this.WatchDataValue('x', {minDifference: 0.1})
        this.WatchDataValue('y', {minDifference: 0.1})
    }

    public Step(delta) {
        super.Step(delta)


        if(this.CanSyncronize()) {
            var distance = Phaser.Math.Distance.BetweenPoints({x: this.X, y: this.Y}, {x: this._targetx, y: this._targety});

            var newPos = {
                x: Phaser.Math.Interpolation.Linear([this.X, this._targetx], 0.01 * delta),
                y: Phaser.Math.Interpolation.Linear([this.Y, this._targety], 0.01 * delta)
            }

            //console.log(this.X, this._targetx)

            this.Set(newPos.x, newPos.y)

            if(distance > 80) {
                this.Set(this._targetx, this._targety)
            }
        }
    }

    public Update(delta: number) {
        super.Update(delta)

        
    }

    public get X(): number {
        this.GetPhysicBodyPosition()
        return this._x
    }

    public get Y(): number {
        this.GetPhysicBodyPosition()
        return this._y
    }

    public SetTarget(x: number, y: number) {
        this._targetx = x
        this._targety = y
    }

    public Set(x: number, y: number) {
        this.SetX(x)
        this.SetY(y)
    }

    public CanSyncronize(): boolean {
        return this.Entity.IsNetworkEntity

        /*
        var networkEntityComponent = this.Entity.GetComponent(NetworkEntityComponent)

        if(!networkEntityComponent) return false

        return networkEntityComponent.CanSyncronize
        */
    }

    public SetX(x: number) {
        this._x = x
        
        this.SetPhysicBodyPosition()
    }

    public SetY(y: number) {
        this._y = y

        this.SetPhysicBodyPosition()
    }

    private GetPhysicBodyPosition() {
        
        if(!this.Entity.HasComponent(PhysicBodyComponent)) return
        
        var physicBody = this.Entity.GetComponent(PhysicBodyComponent)

        if(!physicBody.DefaultBody) return

        var pos = physicBody.DefaultBody.position

        this._x = pos.x
        this._y = pos.y
        
    }

    
    private SetPhysicBodyPosition() {

        if(!this.Entity.HasComponent(PhysicBodyComponent)) return
        
        var physicBody = this.Entity.GetComponent(PhysicBodyComponent)

        if(!physicBody.DefaultBody) return

        physicBody.SetPosition(this._x, this._y)
        
    }

    public ToData(): PositionComponentData {
        var data: PositionComponentData = {
            x: this.X,
            y: this.Y
        }

        return data
    }

    public FromData(data: PositionComponentData) {
        if(this.CanSyncronize()) {
            if(data.x) this._targetx = data.x
            if(data.y) this._targety = data.y
        } else {
            if(data.x) this.SetX(data.x)
            if(data.y) this.SetY(data.y)
        }
        
       

        return data
    }
}