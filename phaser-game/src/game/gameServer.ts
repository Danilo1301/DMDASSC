import { Game } from "@phaserGame/game"

import socketio from 'socket.io';
import { Client } from "@phaserGame/client";

export class GameServer extends Game
{
    constructor(io: socketio.Namespace)
    {
        super()

        this.IsServer = true

        io.on("connection", this.OnSocketConnection.bind(this))
    }

    public Start(): void
    {
        super.Start()

        console.log(`[Game] Starting Server...`)

        this.OnReady()
    }

    public OnReady()
    {
        super.OnReady()

        var server = this.CreateServer('server1')
        server.Start()
    }

    public OnSocketConnection(socket: socketio.Socket)
    {
        var client = new Client(this, socket)

        client.OnConnect()
    }
}