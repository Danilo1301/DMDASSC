import socketio, { Socket } from 'socket.io';

import { Game } from '@phaserGame/game';
import { Server } from '@phaserGame/server';
import { config } from '@phaserGame/game/config'
import { Client } from '@phaserGame/client/client';
import { ServerHost } from '@phaserGame/server/components';

export class GameServer extends Game {
    constructor(io: socketio.Namespace) {
        config.type = Phaser.HEADLESS
        super(config)

        this.Settings.IsServer = true

        io.on("connection", this.OnSocketConnect.bind(this))

        
    }

    public OnSocketConnect(socket: Socket): void {
        var client = new Client(this, socket)

        this.Servers.values()[0].GetComponent(ServerHost).HandleClientConnection(client)
    }

    public Start(): void {
        super.Start()

        var server = this.CreateServer("SERVER_1")
        server.Awake()
        server.Worlds.values()[0].CreateTest()
    }

    public CreateServer(id: string): Server {
        var server = super.CreateServer(id)
        server.AddComponent(new ServerHost())
        return server
    }
    
}