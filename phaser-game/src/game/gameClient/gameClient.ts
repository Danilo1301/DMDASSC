import { Game } from "@phaserGame/game";
import { config } from '@phaserGame/game/config'
import { Server } from "@phaserGame/server";
import { Network } from "@phaserGame/network";

export class GameClient extends Game {
    public MainServer: Server
    public Network: Network
    
    constructor() {
        super(config)

        this.MainServer = this.CreateServer("MAIN_SERVER")

        this.Network = new Network(this)
        this.Network.Settings.TestDelay = 0
        this.Network.Server = this.MainServer
    }

    public Start(): void {
        super.Start()

        this.MainServer.Awake()

        this.Network.Connect()
        this.Network.Send("join_server", {serverId: "SERVER_1"})
    }
}