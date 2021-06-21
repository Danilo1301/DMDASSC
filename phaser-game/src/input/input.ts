export class Input {
    public static MousePosition = {X: 0, Y: 0}
    public static JoyStick = {
        Enabled: false,
        Force: 0,
        Angle: 0,
        KeysDown: []
    }

    private static _keys: number[] = []

    public static get Horizontal(): number {
        var horizontal = (Input.GetKeyDown('a') ? -1 : 0) + (Input.GetKeyDown('d') ? 1 : 0)
        var force = Phaser.Math.Clamp(this.JoyStick.Force / 100, -1, 1)

        if(this.JoyStick.Enabled) {
            horizontal += Math.cos(Phaser.Math.DegToRad(this.JoyStick.Angle)) * force
        }

        return horizontal
    }

    public static get Vertical(): number {
        var vertical = (Input.GetKeyDown('w') ? -1 : 0) + (Input.GetKeyDown('s') ? 1 : 0)
        var force = Phaser.Math.Clamp(this.JoyStick.Force / 100, -1, 1)

        if(this.JoyStick.Enabled) {
            vertical += Math.sin(Phaser.Math.DegToRad(this.JoyStick.Angle)) * force
        }

        return vertical
    }

    //scene.input
    public static Setup(input: Phaser.Input.InputPlugin) {
        var keyboard = input.keyboard
        
        keyboard.addListener('keydown', this.OnKeyDown, this)
        keyboard.addListener('keyup', this.OnKeyUp, this)
        input.addListener('pointermove', this.OnPointerMove, this)
    }

    public static GetKeyDown(key: number | string) {
        var keyCodes: number[] = []

        if(typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        } else {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes) {
            if(this._keys.includes(keyCode)) return true
        }

    }

    private static OnKeyDown(event) {
        if(!this._keys.includes(event.keyCode))
            this._keys.push(event.keyCode)
    }

    private static OnKeyUp(event) {
        if(this._keys.includes(event.keyCode))
            this._keys.splice(this._keys.indexOf(event.keyCode), 1)
    }

    private static OnPointerMove(pointer) {
        let cursor = pointer;

        this.MousePosition.X = cursor.x
        this.MousePosition.Y = cursor.y
    }
}