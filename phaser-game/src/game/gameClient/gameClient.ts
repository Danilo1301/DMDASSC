import { Socket } from "socket.io-client";

import { Game } from "@phaserGame/game";
import { config } from '@phaserGame/game/config'
import { Server } from "@phaserGame/server";
import { Network } from "@phaserGame/game/gameClient";

export class GameClient extends Game {
    public MainServer: Server
    public Network: Network

    constructor(socket: Socket) {
        super(config)

        this.MainServer = this.CreateServer("MAIN_SERVER", false)
        this.Network = new Network(this, socket)
    }

    public Start(): void {
        super.Start()
        
        this.MainServer.Start()
    }

}