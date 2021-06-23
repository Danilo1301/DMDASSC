import { GameClient } from "@phaserGame/game"
import { Input } from "@phaserGame/input"

export class MainMenuScene extends Phaser.Scene {
    public Game!: GameClient

    joyStick
    text

    init(data) {
        this.Game = data.game
    }

    preload() {
        var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);

        this.load.setPath('/static/phaser/assets')
        this.load.image('ball', 'ball.png')
        this.load.image('bullet_tracer1', 'bullet_tracer1.png')
        this.load.image('block1', 'block1.png')
        this.load.image('block2', 'block2.png')
        this.load.image('chest1', 'chest1.png')
        this.load.image('player1', 'player1.png')
        this.load.image('block64', 'block64.png')
        this.load.image('multiplayer', 'multiplayer.png')
        this.load.image('singleplayer', 'singleplayer.png')
        
        this.load.image('items/pistol', 'items/pistol.png')
        this.load.image('items/medkit', 'items/medkit.png')
    }

    create() {
        console.log(`[MainMenuScene] Create`)

        var spriteSingleplayer = this.add.sprite(500, 60, "singleplayer").setInteractive()
        var spriteMultiplayer = this.add.sprite(500, 200, "multiplayer").setInteractive()

        spriteSingleplayer.on("pointerdown", () => {
            console.log(`[MainMenuScene] Singleplayer`)

            this.Game.StartSinglePlayer()

            spriteSingleplayer.destroy()
            spriteMultiplayer.destroy()
        })

        spriteMultiplayer.on("pointerdown", () => {
            console.log(`[MainMenuScene] Multiplayer`)

            this.Game.StartMultiplayer()

            spriteSingleplayer.destroy()
            spriteMultiplayer.destroy()
        })

    
        this,this.text = this.add.text(30,70, '><')

        var t = this.add.text(30,30, '')
        setInterval(() => {
            t.setText(`${this.game.loop.actualFps}`)
        }, 500)

        var pl: any = this.plugins.get('rexvirtualjoystickplugin')

        this.game.input.addPointer();

        this.joyStick = pl.add(this, {
            x: 150,
            y: 450,
            radius: 100,
            base: this.add.circle(0, 0, 100, 0x888888),
            thumb: this.add.circle(0, 0, 50, 0xcccccc),
            // dir: '8dir',
            // forceMin: 16,
            // fixed: true,
            // enable: true
        }).on('update', this.dumpJoyStickState, this);

        Input.JoyStick.Enabled = true
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = 'Key down: ';
        var keys: string[] = []
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += name + ' ';
                keys.push(name)
            }
        }
        s += '\n';
        s += ('Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n');
        s += ('Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n');

        this.text.setText(s);

        Input.JoyStick.Force = this.joyStick.force
        Input.JoyStick.Angle = this.joyStick.angle
    }

    render() {
        var game = this.game
        // show what is going on with the pointers array.
        game.input.pointers.forEach(function (pointer) {
 
            
 
        });
 
    }
}