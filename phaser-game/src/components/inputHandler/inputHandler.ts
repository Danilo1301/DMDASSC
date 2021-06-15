import { Component, WorldEntity } from "@phaserGame/utils";
import { PhysicBody } from "../physicBody";


export class InputHandler extends Component {
    public Entity: WorldEntity | undefined
    
    private _keys: number[] = []
    private _listeners: Phaser.Input.Keyboard.KeyboardPlugin[] = []

    public ControlledByPlayer: boolean = false
    
    constructor() {
        super()
    }

    public Awake(): void {
        this.Entity!.World.Scene.input.keyboard.addListener('keydown', this.OnKeyDown, this)

        this.Entity!.World.Scene.input.keyboard.addListener('keyup', this.OnKeyUp, this)

    }

    private OnKeyDown(event) {
        if(!this.ControlledByPlayer) return
        this.SetKeyDown(event.keyCode)
    }

    private OnKeyUp(event) {
        if(!this.ControlledByPlayer) return
            this.SetKeyDown(event.keyCode, false)
    }
    
    public Update(delta: number): void {
        var physicBody = this.Entity?.GetComponent(PhysicBody)

        if(!physicBody) return

        var sprite = physicBody.Sprite

        if(sprite) {
            var force = {
                x: 0,
                y: 0
            }

            var speed = 0.0008
            var maxSpeed = 4;

            if(sprite.body.velocity.x > -maxSpeed && this._keys.includes(65)) force.x = -speed
            if(sprite.body.velocity.x < maxSpeed && this._keys.includes(68)) force.x = speed

            if(sprite.body.velocity.y > -maxSpeed && this._keys.includes(87)) force.y = -speed
            if(sprite.body.velocity.y < maxSpeed && this._keys.includes(83)) force.y = speed

            sprite.applyForce(new Phaser.Math.Vector2(force.x * delta, force.y * delta))
        }
    }

    public SetKeyDown(keyCode: number, down: boolean = true) {
        if(down) {
            if(!this._keys.includes(keyCode)) this._keys.push(keyCode)
        } else {
            if(this._keys.includes(keyCode)) this._keys.splice(this._keys.indexOf(keyCode), 1)
        }
    }

    public Destroy(): void {
        for (const listener of this._listeners) {
            listener.removeListener('keydown', this.OnKeyDown)
            listener.removeListener('keyup', this.OnKeyUp)
        }

        this._listeners = []
    }
}