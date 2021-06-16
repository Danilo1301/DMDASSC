import { Component, WorldEntity } from "@phaserGame/utils";
import { NetworkEntity } from "../networkEntity";
import { Position } from "../position";

export interface PhysicBodyData {
    spriteName?: string
    velocityX?: number
    velocityY?: number
    angle?: number
}

export class PhysicBody extends Component {
    public Entity: WorldEntity | undefined
    public Sprite?: Phaser.Physics.Matter.Sprite

    private _targetVelocityX: number = 0
    private _targetVelocityY: number = 0
    private _targetAngle: number = 0

    private _spriteName: string = ""

    constructor(data?: PhysicBodyData) {
        super()

        if(data) this.FromData(data)
    }

    public Awake(): void {
        var matter = this.Entity!.World.Scene.matter

        var position = this.Entity?.GetComponent(Position)!

        var pos = {
            x: position.X,
            y: position.Y
        }
      
        this.Sprite = matter.add.sprite(0, 0, this._spriteName)

        var sprite = this.Sprite!.setInteractive()

        sprite.on('pointerdown', function (pointer) {
            sprite.setTint(0x000000)
        });

        sprite.on('pointerup', function (pointer) {
            sprite.setTint(0xFFFFFF)
        });

        var opt: MatterJS.IChamferableBodyDefinition = {mass: 10, frictionAir: 0.1, restitution: 0.99}
        
        if(this._spriteName == 'ball') {
            opt.restitution = 0.99
            opt.frictionAir = 0.01
        }

        
        //var body1 = matter.bodies.circle(0, 0, 16, opt);
        var body2 = matter.bodies.rectangle(0, 0, 32, 32, opt);
        
        opt.parts = [body2]

        var cbody = matter.body.create(opt)
        

        sprite.setExistingBody(cbody)

        this.Entity?.World.Scene.events.on('update', (time, delta) => {
            this.Update(delta)
        })

        sprite.setPosition(pos.x, pos.y)

       
    }
    
    public Update(delta: number): void {
        if(this.CanSync() && this.Sprite) {
            var currentVelocity = this.Sprite.body.velocity
            var currentAngle = this.Sprite.angle

            var newVelocity = {
                x: Phaser.Math.Interpolation.Linear([currentVelocity.x, this._targetVelocityX], 1),
                y: Phaser.Math.Interpolation.Linear([currentVelocity.y, this._targetVelocityY], 1)
            }

            var newAngle = Phaser.Math.Interpolation.Linear([currentAngle, this._targetAngle], 0.5)

            if(Math.abs(Math.abs(currentAngle) - Math.abs(this._targetAngle)) > 10) newAngle = this._targetAngle

            this.Sprite.setAngle(newAngle)
            this.Sprite.setVelocity(newVelocity.x, newVelocity.y)
        }
    }

    public Destroy(): void {
        this.Sprite?.destroy()
        this.Sprite = undefined
    }
    
    public CanSync(): boolean {
        var networkEntity = this.Entity?.GetComponent(NetworkEntity)
        if(!networkEntity) return false
        return networkEntity.SyncEnabled
    }

    public FromData(data: PhysicBodyData) {
        if(data.spriteName) this._spriteName = data.spriteName
        
        if(this.CanSync()) {
            this._targetVelocityX = data.velocityX || 0
            this._targetVelocityY = data.velocityY || 0
            this._targetAngle = data.angle || 0
        } else {
            if(data.velocityX) this.Sprite?.setVelocityX(data.velocityX)
            if(data.velocityY) this.Sprite?.setVelocityY(data.velocityY)
            if(data.angle) this.Sprite?.setAngle(data.angle)
        }

        

        //console.log(data)
    }

    public ToData(): PhysicBodyData | undefined {
        if(!this.Sprite) return undefined

        var body = this.Sprite.body as MatterJS.BodyType

        var data: PhysicBodyData = {
            spriteName: this._spriteName,
            velocityX: body.velocity.x,
            velocityY: body.velocity.y,
            angle: this.Sprite.angle
        }

        return data
    }
}