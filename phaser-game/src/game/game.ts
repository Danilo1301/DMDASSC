import Phaser from 'phaser'
import { Server } from "@phaserGame/server";



export abstract class Game extends Phaser.Game {
    public ASSETS_PATH = '/static/phaser/assets/'

    public Servers = new Phaser.Structs.Map<string, Server>([])
    
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)

        this.events.on("ready", this.Start, this)
    }

    public CreateServer(id: string, autoStart?: boolean): Server {
        autoStart = autoStart === undefined ? true : autoStart

        var server = new Server(id, this)
        this.Servers.set(id, server)
        if(autoStart) server.Start()
        
        return server
    }

    public Start(): void {
        console.log("Game.Start()")
    }
}





