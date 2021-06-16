import Phaser from 'phaser'
import { Server } from "@phaserGame/server";
import { GameScene } from './gameScene';
import { GameServer } from './gameServer';
import { EntityFactory } from '@phaserGame/entityFactory';



export abstract class Game extends Phaser.Game {
    public Scene!: GameScene
    public Servers = new Phaser.Structs.Map<string, Server>([])

    public Settings = {
        IsServer: false,
        AssetsPath: '/static/phaser/assets/'
    }
    
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)

        EntityFactory.Setup()

        this.events.on("ready", () => {
            //console.log("READY")
        })
    }

    public Preload(scene: GameScene) {
        if(this.Settings.IsServer) return

        var load = scene.load;
        
        console.log(`[Game] Loading assets '${this.Settings.AssetsPath}'...`)

        load.setPath(this.Settings.AssetsPath)
        load.image('ball', 'ball.png')
        load.image('player1', 'player1.png')
        load.image('player2', 'player2.png')
        load.image('block1', 'block1.png')
        load.image('block2', 'block2.png')
    }

    public Start(): void {
        console.log("[Game] Start")


        //this.Scene = this.scene.getAt(0) as GameScene
    }

    public CreateServer(id: string): Server {
        //autoStart = autoStart === undefined ? true : autoStart

        var server = new Server(id, this)
        this.Servers.set(id, server)
        
        return server
    }
}





