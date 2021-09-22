export class Input {

    private static _keys = new Map<number, boolean>();

    public static setup(scene: Phaser.Scene) {
        scene.input.keyboard.on('keydown', (e) => {
            this._keys.set(e.keyCode, true);
        })

        scene.input.keyboard.on('keyup', (e) => {
            this._keys.set(e.keyCode, false);
        })
    }

    public static getKeyDown(key: number | string)
    {
        const keyCodes: number[] = []

        if(typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        } else {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes) {
            const state = this._keys.get(keyCode) === true;
            if(state) return true;
        }

        return false;
    }

    public static getHorizontal() {
        let horizontal = (this.getKeyDown('a') ? -1 : 0) + (this.getKeyDown('d') ? 1 : 0)
        
        
        /*
        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)


        if(this._joyStick.enabled) {
            horizontal += Math.cos(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }
        */

        return horizontal
    }

    public static getVertical() {
        let vertical = (this.getKeyDown('w') ? -1 : 0) + (this.getKeyDown('s') ? 1 : 0)

        /*
        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)

        if(this._joyStick.enabled)
        {
            vertical += Math.sin(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }
        */

        return vertical
    }
}