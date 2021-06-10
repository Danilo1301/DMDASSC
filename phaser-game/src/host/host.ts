import { Server } from "@phaserGame/server";
import { Client } from '@phaserGame/game/gameServer/client';

export class Host {
    public Server: Server

    constructor(server: Server) {
        this.Server = server
    }

    public OnClientJoin(client: Client) {
        console.log("clclient")

        var defaultWorld = this.Server.Worlds.values()[0]

        client.Server = this.Server
        client.World = defaultWorld
        client.Entity = client.World.EntityFactory.CreateEntity('EntityPlayer', null)

        client.Send("connected", {entityId: client.Entity.Id})
    }
}