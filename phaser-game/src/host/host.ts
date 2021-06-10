import { Server } from "@phaserGame/server";
import { Client } from '@phaserGame/client';
import { Entity } from "@phaserGame/utils";
import { PacketId } from "@phaserGame/server/packets";

export class Host {
    public Server: Server

    constructor(server: Server) {
        this.Server = server
    }

    public OnClientJoin(client: Client) {
        console.log(`Client ${client.Id} joined server ${this.Server.Id}`)

        var defaultWorld = this.Server.Worlds.values()[0]

        client.Server = this.Server
        client.World = defaultWorld
        client.Entity = client.World.EntityFactory.CreateEntity('EntityPlayer', null)

        client.World.Events.addListener('entityDestroyed', (entity: Entity) => {
            client.Send("entityDestroyed", new PacketId(entity.Id))
        })

        client.OnJoinServer(this.Server)
    }

    public OnClientLeave(client: Client) {
        console.log(`Client ${client.Id} left server ${this.Server.Id}`)

        var world = client.World!;

        if(client.Entity) world.EntityFactory.DestroyEntity(client.Entity)

        client.Server = undefined
        client.World = undefined
        client.Entity = undefined
    }
}