import socketio from 'socket.io';

import { Game } from '@phaserGame/game';
import { Server } from '@phaserGame/server';
import { config } from '@phaserGame/game/config'
import { Host } from '@phaserGame/host';
import { Client } from '@phaserGame/game/gameServer/client';

export class GameServer extends Game {
    public Clients: Phaser.Structs.Map<string, Client>

    constructor(io: socketio.Namespace, assetsPath: string) {
        config.type = Phaser.HEADLESS
        super(config)

        this.Clients = new Phaser.Structs.Map<string, Client>([])
        this.ASSETS_PATH = assetsPath

        io.on("connection", this.OnSocketConnect.bind(this))
    }

    public OnSocketConnect(socket: socketio.Socket): void {
        var client = new Client(socket)

        var server = this.Servers.values()[0]
        server.Host!.OnClientJoin(client)

        console.log(`[PhaserGame] Socket ${socket.id} connected`)
    }

    public Start(): void {
        super.Start()

        var server = this.CreateServer("SERVER_1", true)
        server.SetupDemo()
    }

    public CreateServer(id: string, autoStart?: boolean): Server {
        var server = super.CreateServer(id, autoStart)
        server.Host = new Host(server)
        return server
    }
    
}