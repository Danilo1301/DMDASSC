import { Server } from '@phaserGame/server';

import { Packet, PacketData, PacketEntities, PacketEntityInfo, PacketId } from '@phaserGame/server/packets';
import { Entity } from '@phaserGame/utils';

import { World } from '@phaserGame/world';
import socketio from 'socket.io';
import { InputHandler, Position } from '../game/components';
import { SyncHelper } from '../game/components/syncHelper';

const testDelay = 0

export class Client {
    public Socket: socketio.Socket

    public Server: Server | undefined
    public World: World | undefined
    public Entity: Entity | undefined

    private _packets: PacketData[] = []

    public get Id(): string {
        return this.Socket.id
    }

    public get IsConnected(): boolean {
        return this.Socket.connected
    }

    constructor(socket: socketio.Socket) {
        this.Socket = socket

        this.Socket.on('packets', (packets, callback) => {
            for (const packet of packets) this.OnReceivePacket(packet.Key, packet.Data)

            setTimeout(() => {
                this.SendEssentialPackets()
                callback(this._packets)
                this.ClearPackets()
            }, testDelay)
        })

        this.Socket.on('disconnect', this.OnDisconnect.bind(this))

        console.log(`[Client] Client ID ${this.Id} connected`)
    }

    public JoinServer(server: Server): void {
        //if can join
        server.Host!.OnClientJoin(this)
    }

    public OnJoinServer(server: Server) {
        
        this.Send("connected", new PacketId(this.Entity!.Id))
    }

    public OnDisconnect(): void {
        console.log(`[Client] Client ID ${this.Id} disconnected`)

        this.Server?.Host?.OnClientLeave(this)
    }

    public ClearPackets(): void {
        this._packets = []
    }

    public SendEssentialPackets(): void {
        this.SendEntities()
    }

    public SendEntities(): void {
        if(!this.World) return

        var data = new PacketEntities()

        for (const entity of this.World.EntityFactory.Entities) {
            var epacket = new PacketEntityInfo(entity)

            data.Entities.push(epacket)
        }

        this.Send("entities", data)
    }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)
        this._packets.push(packet)
    }

    public OnReceivePacket(key: string, data: PacketData) {
        if(key == "joinServer") {
            console.log("joinServer")
        }

        if(key == "newBot") {
            console.log("newBot")
            this.World?.EntityFactory.CreateBot(400, 300)
        }

        if(key == "newBall") {
            console.log("newBall")
            this.World?.EntityFactory.CreateEntity('EntityCrate', null)
        }

        if(key == "client_entities") this.OnReceivePacket_ClientEntities(data as PacketEntities)
    }

    public OnReceivePacket_ClientEntities(data: PacketEntities) {
        var entity = this.Entity!
        var entityData = data.Entities[0]

        var inputHandler = entity.GetComponent(InputHandler)


        for (const input of entityData.Inputs) {
            inputHandler.SetKeyDown(input.Name, input.IsDown)
        }

        if(!entity.HasComponent(SyncHelper)) {
            entity.AddComponent(new SyncHelper())
        }

        var syncHelper = entity.GetComponent(SyncHelper)
        syncHelper.Data = entityData
    }
}