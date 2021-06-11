import { Server } from "@phaserGame/server";
import { Client } from '@phaserGame/client';
import { Entity } from "@phaserGame/utils";
import { PacketEntities, PacketEntityInfo, PacketId } from "@phaserGame/server/packets";

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

        client.World.Events.addListener('entity_set_position', (entity: Entity, x: number, y: number) => {

            //console.log("entity_set_position", entity.Id, x, y)

            var packetEntity = new PacketEntities();
            var info = new PacketEntityInfo(entity)
            info.ForceSync = true

            packetEntity.Entities.push(info)

            client.Send("entities", packetEntity)
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