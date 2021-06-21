import { Game } from "@phaserGame/game"

import socketio from 'socket.io';
import { Client } from "@phaserGame/client";

export class GameServer extends Game {
    constructor(io: socketio.Namespace) {
        super()

        this.IsServer = true


        console.log("created")

        io.on("connection", (socket) => {
            var client = new Client(this, socket)
        })
    }

    public Start(): void {
        super.Start()

        console.log(`[Game] Starting Server...`)

        this.OnReady()
    }

    public OnReady() {
        super.OnReady()

        var server = this.CreateServer('server1')
        server.Start()


    }
}