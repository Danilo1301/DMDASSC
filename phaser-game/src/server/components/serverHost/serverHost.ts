import { Client } from "@phaserGame/client";
import { Server } from "@phaserGame/server";
import { Component } from "@phaserGame/utils";

export class ServerHost extends Component {
    public Entity: Server | undefined
    
    private _clients = new Phaser.Structs.Map<string, Client>([])

    constructor() {
        super()
    }

    public Awake(): void {
    }

    public Update(delta: number): void {
    }

    public Destroy(): void {
    }

    public HandleClientConnection(client: Client) {
        console.log("[ServerHost] New client connected", client.Id)

        this._clients.set(client.Id, client)

        
    }
}