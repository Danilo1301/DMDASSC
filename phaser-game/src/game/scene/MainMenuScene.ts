import GameClient from "../GameClient";

export default class MainMenuScene extends Phaser.Scene
{
    public Game!: GameClient
    
    public init(data) {
        this.Game = data.game
    }

    public preload()
    {
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

    public create()
    {
        this.cameras.main.setBackgroundColor(0x000000)

        console.log(`[MainMenuScene] Create`)

        var centerX = this.cameras.main.centerX
        var centerY = this.cameras.main.centerY

        var spriteSingleplayer = this.add.sprite(centerX, centerY - 70, "singleplayer").setInteractive()
        var spriteMultiplayer = this.add.sprite(centerX, centerY + 70, "multiplayer").setInteractive()

        spriteSingleplayer.on("pointerdown", () => {
            console.log(`[MainMenuScene] Singleplayer`)

            this.Game.startSinglePlayer()

            spriteSingleplayer.destroy()
            spriteMultiplayer.destroy()
        })

        spriteMultiplayer.on("pointerdown", () => {
            console.log(`[MainMenuScene] Multiplayer`)

            this.Game.startMultiplayer()

            spriteSingleplayer.destroy()
            spriteMultiplayer.destroy()
        })
    }
}