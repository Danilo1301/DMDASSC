import { Position, WorldText } from '@phaserGame/components';
import { NetworkEntity } from '@phaserGame/components/networkEntity';
import { GameServer } from '@phaserGame/game';
import { Packet, PacketData, PacketDataEntity, PacketManager } from '@phaserGame/packets';
import { WorldEntity } from '@phaserGame/utils';
import { World } from '@phaserGame/world';
import { Socket } from 'socket.io';

export class Client {
    public Socket: Socket
    public Game: GameServer

    public PacketManager: PacketManager

    public Entity?: WorldEntity

    public World?: World
    private _entities = new Phaser.Structs.Map<string, WorldEntity>([])

    constructor(game: GameServer, socket: Socket) {
        this.Game = game
        this.Socket = socket

        this.PacketManager = new PacketManager()
        this.PacketManager.AutoSend = false

        this.PacketManager.fnSendPackets = function (packets: Packet[], callback: (packets: Packet[]) => void) {
            socket.emit('packets', packets, callback)
        }

        game.events.on("step", (time, delta) => this.Update(delta))

        this.Socket.on("packets", (packets: Packet[], callback: (packets: Packet[]) => void) => {
            for (const packet of packets) {
                this.OnReceivePacket(packet.Key, packet.Data)
            }

            this.PacketManager.fnOnReceivePackets(packets, callback)
        })

        this.Socket.on("disconnect", () => {
            if(this.Entity) 
                this.Entity.World.EntityFactory.DestroyEntity(this.Entity)
        })
    }

    public get Id(): string { return this.Socket.id }

    public get IsConnected(): boolean { return this.Socket.connected }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)

        this.PacketManager.AddPacket(packet)
    }

    public Update(delta: number): void {
        this.PacketManager.Update(delta)

        if(!this.World) return

        var worldEntities: WorldEntity[] = []
        
        for (const entity of this.World.EntityFactory.ActiveEntities) {
            if(entity.HasComponent(NetworkEntity)) worldEntities.push(entity)
        }
       

        for (const entity of worldEntities) {
            var myPos = {x: 0, y: 0}

            if(this.Entity) {
                var position = this.Entity.GetComponent(Position)
                myPos.x = position.X
                myPos.y = position.Y
            }

            var entityPositionComponent = entity.GetComponent(Position)
            var entityPos = {x: entityPositionComponent.X, y: entityPositionComponent.Y}

            var distance = Phaser.Math.Distance.BetweenPoints(myPos, entityPos)

       
            if(distance < 2000) {
                if(!this._entities.has(entity.Id)) {
                    this._entities.set(entity.Id, entity)
    
                    this.Send("entity_streamed_in", {entity: new PacketDataEntity(entity)})

                    
                }

                this.Send("entity_data", {entity: new PacketDataEntity(entity)})
            } else {
                if(this._entities.has(entity.Id)) {
                    this._entities.delete(entity.Id)
    
                    this.Send("entity_streamed_out", {entityId: entity.Id})

                    
                }
            }
            
        }
    }

    public OnReceivePacket(key: string, data: PacketData): void {
        if(key == "join_server") {

            var server = this.Game.Servers.values()[0]

            this.World = server.Worlds.values()[0]
            this.Entity = this.World.EntityFactory.CreateEntity("EntityPlayer")
            this.Entity.GetComponent(WorldText).FromData({text: "Player " + this.Id})

            this.Send("join_server_status", {
                entityId: this.Entity.Id
            })
        }

        if(key == "player_data") {
            var cdata: any = data

            if(this.Entity) 
                this.Entity.GetComponent(NetworkEntity).SetComponentsData(cdata)
        }
    }
}