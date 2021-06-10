import { Server } from '@phaserGame/server';

import { Packet, PacketData, PacketEntities, PacketEntityInfo } from '@phaserGame/server/packets';
import { Entity } from '@phaserGame/utils';

import { World } from '@phaserGame/world';
import socketio from 'socket.io';
import { InputHandler, Position } from '../components';
import { SyncHelper } from '../components/syncHelper';

const testDelay = 1

export class Client {
    public Socket: socketio.Socket

    public Server: Server | undefined
    public World: World | undefined
    public Entity: Entity | undefined

    private _packets: PacketData[] = []

    constructor(socket: socketio.Socket) {
        this.Socket = socket

        this.Socket.on('packets', (packets, callback) => {
            for (const packet of packets) this.OnReceivePacket(packet)

            this.SendEntities()

            setTimeout(() => {
                callback(this._packets)
                this._packets = []
            }, testDelay)
        })
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

    public OnReceivePacket(packet: Packet) {
        if(packet.Key == "joinServer") {
            console.log("joinServer")
        }

        if(packet.Key == "client_entities") {
            var data = packet.Data as PacketEntities

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
            syncHelper.Position.X = entityData.Position.X
            syncHelper.Position.Y = entityData.Position.Y
        }

        if(packet.Key == "myposition") {
    
            if(this.Entity) {
                //this.Entity.GetComponent(Position).Set(packet.Data['X'], packet.Data['Y'])
            }
        }
    }
}