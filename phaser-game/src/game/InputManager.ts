export default class InputManager
{
    private _mousePosition = {
        x: 0,
        y: 0
    }

    private _joyStick = {
        enabled: false,
        force: 0,
        angle: 0,
        keysDown: []
    }

    private _keys: number[] = []

    public initialize(input: Phaser.Input.InputPlugin)
    {
        var keyboard = input.keyboard
        
        keyboard.addListener('keydown', this.onKeyDown, this)
        keyboard.addListener('keyup', this.onKeyUp, this)

        input.addListener('pointermove', this.onPointerMove, this)
    }

    private onKeyDown(event)
    {
        if(!this._keys.includes(event.keyCode)) this._keys.push(event.keyCode)
    }

    private onKeyUp(event)
    {
        if(this._keys.includes(event.keyCode)) this._keys.splice(this._keys.indexOf(event.keyCode), 1)
    }

    private onPointerMove(pointer)
    {
        let cursor = pointer;

        this._mousePosition.x = cursor.x
        this._mousePosition.x = cursor.y
    }

    public getHorizontal()
    {
        var horizontal = (this.getKeyDown('a') ? -1 : 0) + (this.getKeyDown('d') ? 1 : 0)
        
        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)

        if(this._joyStick.enabled)
        {
            horizontal += Math.cos(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }

        return horizontal
    }

    public getVertical()
    {
        var vertical = (this.getKeyDown('w') ? -1 : 0) + (this.getKeyDown('s') ? 1 : 0)

        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)

        if(this._joyStick.enabled)
        {
            vertical += Math.sin(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }

        return vertical
    }

    public getKeyDown(key: number | string)
    {
        var keyCodes: number[] = []

        if(typeof key == 'string')
        {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        }
        else
        {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes)
        {
            if(this._keys.includes(keyCode)) return true
        }

    }
}