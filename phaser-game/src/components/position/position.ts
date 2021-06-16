import { Component } from "@phaserGame/utils";
import { NetworkEntity } from "../networkEntity";
import { PhysicBody } from "../physicBody";

export interface PositionData {
    x?: number
    y?: number
}

export class Position extends Component {
    private _x: number = 0
    private _y: number = 0


    private _targetX: number = 0
    private _targetY: number = 0


    private _timeToLerp = 0
    private _lerping = false

    constructor(data?: PositionData) {
        super()

        if(data) this.FromData(data)
    }

    public get X(): number {
        this.UpdatePosition()
        return this._x
    }

    public get Y(): number {
        this.UpdatePosition()
        return this._y
    }

    public Set(x: number, y: number) {
        this._x = x
        this._y = y

        var physicBody = this.Entity?.HasComponent(PhysicBody) ? this.Entity.GetComponent(PhysicBody) : undefined

        if(!physicBody) return
        if(!physicBody.Sprite) return

        physicBody.Sprite.setPosition(x, y)

        this.UpdatePosition()
    }

    private UpdatePosition() {
        var physicBody = this.Entity?.HasComponent(PhysicBody) ? this.Entity.GetComponent(PhysicBody) : undefined

        if(!physicBody) return
        if(!physicBody.Sprite) return

        var body = physicBody.Sprite!.body

        this._x = body.position.x
        this._y = body.position.y
    }

    public Awake(): void {
   
    }
    
    public Update(deltaTime: number): void {
        this.UpdatePosition()

        this._timeToLerp += deltaTime

        if(this._timeToLerp > 300 && !this._lerping) {
            this._lerping = true
            this._timeToLerp = 0
        }

        if(this.CanSync()) {
            var distance = Phaser.Math.Distance.BetweenPoints({x: this.X, y: this.Y}, {x: this._targetX, y: this._targetY});

            if(this._lerping) {
                var newPos = {
                    x: Phaser.Math.Interpolation.Linear([this.X, this._targetX], 0.15),
                    y: Phaser.Math.Interpolation.Linear([this.Y, this._targetY], 0.15)
                }

                this.Set(newPos.x, newPos.y)

                if(distance > 20) {
                    this.Set(this._targetX, this._targetY)
                    this._lerping = false
                }

                if(distance < 1) {
                    this._lerping = false
                }
            }
            

            //

            if(distance > 10) {
                //this.Set(this._targetX, this._targetY)
            }
            
            
        }
    }

    public Destroy(): void {
    
    }

    public CanSync(): boolean {
        var networkEntity = this.Entity?.GetComponent(NetworkEntity)
        if(!networkEntity) return false
        return networkEntity.SyncEnabled
    }

    public FromData(data: PositionData) {

        if(this.CanSync()) {
            this._targetX = data.x || this._x
            this._targetY = data.y || this._y
            return
        }

        if(data.x) this._x = data.x
        if(data.y) this._y = data.y

        this.Set(this._x, this._y)
    }

    public ToData(): PositionData {
        var data: PositionData = {
            x: this.X,
            y: this.Y
        }

        return data
    }
}