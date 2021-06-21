import { PositionComponent } from '@phaserGame/components';
import { GameServer } from '@phaserGame/game';
import { Packet, PacketData } from '@phaserGame/packets';
import { WorldEntity } from '@phaserGame/utils';
import { World } from '@phaserGame/world';
import { Socket } from 'socket.io';
import { EntityWatcher } from './entityWatcher';



export class Client {
    public Socket: Socket
    public Game: GameServer

    public EntityWatcher: EntityWatcher

    public Entity?: WorldEntity

    public World?: World

    private _packets: Packet[] = []

    

    constructor(game: GameServer, socket: Socket) {
        this.Game = game
        this.Socket = socket
        this.EntityWatcher = new EntityWatcher()


        this.Socket.on("packets", (packets: Packet[], callback) => {
            for (const packet of packets) this.OnReceivePacket(packet.Key, packet.Data)

            callback(this._packets)

            this._packets = []
        })

        setInterval(() => {
            this.Update()
        }, 20)

        console.log(`[Client] ID ${this.Id} connected`)
    }

    public get Id(): string { return this.Socket.id }

    public get IsConnected(): boolean { return this.Socket.connected }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)

        this._packets.push(packet)
    }


    public Update(): void {
        if(this.World) {
            for (const entity of this.World.EntityFactory.Entities) {
                if(!this.EntityWatcher.HasEntity(entity)) {
                    var info = this.EntityWatcher.AddEntity(entity)

                    var entitydata = info.FormatEntityComponentsData(false)

                    this.Send("entity_stream_in", entitydata.data)
                }
            }
        }

        this.EntityWatcher.Update()

        for (const info of this.EntityWatcher.EntitiesInfo) {
            var entity = info.Entity

            var entitydata = info.FormatEntityComponentsData(true)
      
            if(entitydata.hasNewValues) {
                this.Send("entity_data", entitydata.data)
            }

            info.NewComponentsData = {}
        }
    }

    public OnReceivePacket(key: string, data: PacketData): void {
        //console.log(`[Client] Received ${key}`, data)

        if(key == "join_server") {
            var server = this.Game.Servers[0]

            this.World = server.Worlds[0]

            server._clients.set(this.Id, this)

            this.Entity = this.World.EntityFactory.CreateEntity("EntityPlayer", {autoActivate: true})

            //this.EntityWatcher.World = this.World

            this.Send("join_server_status", {joined: true, id: this.Entity.Id})
        }

        if(key == "client_data") {
            var x = data['x']
            var y = data['y']

            var entity = this.Entity

            if(entity) {
                var position = entity.GetComponent(PositionComponent)

                position.Set(x, y)
            }
        }

        if(key == "call_component_function") {
            this.OnReceivePacket_call_component_function(data)
            
        }

    }

    public OnReceivePacket_call_component_function(data) {
        console.log('call_component_function', data)

        var world = this.World!

        var entity = world.EntityFactory.GetEntity(data['entityId'])

        for (const component of entity.Components) {
            if(component.constructor.name == data['component']) {
                component.OnReceiveComponentFunction(data['key'], this.Id)
            }
        }
    }
}