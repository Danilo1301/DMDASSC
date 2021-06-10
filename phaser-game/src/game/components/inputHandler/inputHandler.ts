import { PacketData } from "@phaserGame/server/packets"
import { Entity, IComponent } from "@phaserGame/utils"

export class InputInfo {
    public Name: string
    public KeyCode: number
    public IsDown: boolean

    constructor(name: string, keyCode: number) {
        this.Name = name
        this.KeyCode = keyCode
        this.IsDown = false
    }
}

export class InputHandler implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    private _isControlledByPlayer: boolean = false

    private _inputs = new Phaser.Structs.Map<string, InputInfo>([])


    public IsKeyDown(key: string): boolean {
        return this._inputs.get(key).IsDown
    }

    public SetKeyDown(key: string, isDown: boolean): void {
        this._inputs.get(key).IsDown = isDown
    }

    public GetInputs(): InputInfo[] {
        return this._inputs.values()
    }

    public Awake(): void {
        this.AddInput('LEFT', 65)
        this.AddInput('RIGHT', 68)
        this.AddInput('UP', 87)
        this.AddInput('DOWN', 83)


        this.Entity.Scene.input.keyboard.on('keydown', (event) => {

            if(!this._isControlledByPlayer) return

            var keyCode = event.keyCode

            for (const input of this._inputs.values()) {
                if(input.KeyCode != keyCode) continue
                input.IsDown = true
            }
        })

        this.Entity.Scene.input.keyboard.on('keyup', (event) => {
            if(!this._isControlledByPlayer) return

            var keyCode = event.keyCode

            for (const input of this._inputs.values()) {
                if(input.KeyCode != keyCode) continue
                input.IsDown = false
            }
        })
    }

    public GetHorizontal(): number {
        return (this.IsKeyDown('LEFT') ? -1 : 0) + (this.IsKeyDown('RIGHT') ? 1 : 0)
    }

    public GetVertical(): number {
        return (this.IsKeyDown('UP') ? -1 : 0) + (this.IsKeyDown('DOWN') ? 1 : 0)
    }

    public Update(deltaTime: number): void {
    }

    public SetControlledByPlayer(value: boolean): void {
        this._isControlledByPlayer = value
    }

    public AddInput(name: string, keyCode: number): void {
        var inpuptInfo = new InputInfo(name, keyCode)
        this._inputs.set(name, inpuptInfo)
    }

    public Destroy(): void {
        
    }
}