import { PositionComponent } from '@phaserGame/components';
import { GameServer } from '@phaserGame/game';
import { Packet, PacketData, PacketDataComponentFunction } from '@phaserGame/packets';
import { Server } from '@phaserGame/server';
import { ComponentFunctionData, WorldEntity } from '@phaserGame/utils';
import { World } from '@phaserGame/world';
import { Socket } from 'socket.io';
import ClientPacketProcess from './clientPacketProcess';
import { EntityWatcher } from './entityWatcher';



export class Client
{
    public Socket: Socket

    public Game: GameServer

    public EntityWatcher: EntityWatcher

    public Entity?: WorldEntity

    public Server?: Server

    public WorldIndex: number = 0

    public ClientPacketProcess: ClientPacketProcess

    private _packets: Packet[] = []

    constructor(game: GameServer, socket: Socket)
    {
        this.Game = game
        this.Socket = socket
        this.EntityWatcher = new EntityWatcher()
        this.ClientPacketProcess = new ClientPacketProcess(this)

        this.SetupListeners()
    }

    public get Id(): string { return this.Socket.id }

    public get IsConnected(): boolean { return this.Socket.connected }

    public SetupListeners()
    {
        this.Socket.on("packets", (packets: Packet[], callback) =>
        {
            for (const packet of packets) this.OnReceivePacket(packet.Key, packet.Data)

            callback(this._packets)

            this._packets = []
        })

        setInterval(() =>{ this.Update() }, 20)

        this.Socket.on("disconnect", this.OnDisconnect.bind(this))
    }

    public OnConnect()
    {
        console.log(`[Client] ID ${this.Id} connected`)
    }

    public OnDisconnect()
    {
        if(this.Server) {
            this.Server.OnClientLeave(this)
        }
    }

    public Send(key: string, data: PacketData): void
    {
        var packet = new Packet(key, data)

        this._packets.push(packet)
    }

    public GetCurrentServerWorld(): World | undefined
    {
        return this.Server?.Worlds[this.WorldIndex]
    }

    public Update(): void
    {
        if(!this.IsConnected) return

        var world = this.GetCurrentServerWorld()

        if(world)
        {
            for (const entity of world.EntityFactory.Entities)
            {
                var position = this.Entity!.GetComponent(PositionComponent)
                var entityPosition = entity.GetComponent(PositionComponent)
                var distance = Phaser.Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: entityPosition.X, y: entityPosition.Y})

                if(distance < 200)
                {
                    if(!this.EntityWatcher.HasEntity(entity))
                    {
                        var info = this.EntityWatcher.AddEntity(entity)
    
                        var entitydata = info.FormatEntityComponentsData(false)
    
                        this.Send("entity_stream_in", entitydata.data)
                    }
                }
                else {
                    if(this.EntityWatcher.HasEntity(entity))
                    {
                        this.EntityWatcher.RemoveEntity(entity)

                        this.Send("entity_stream_out", entity.Id)
                    }
                }
                
            }
        }

        this.EntityWatcher.Update()

        for (const info of this.EntityWatcher.EntitiesInfo)
        {
            var entitydata = info.FormatEntityComponentsData(true)
      
            if(entitydata.hasNewValues)
            {
                this.Send("entity_data", entitydata.data)
            }

            info.NewComponentsData = {}
        }
    }

    public OnReceivePacket(key: string, data: PacketData): void
    {
        //console.log(`[Client] Received ${key}`, data)

        if(key == "join_server")
            this.ClientPacketProcess.OnJoinServer(data)

        if(key == "client_data")
            this.ClientPacketProcess.OnClientData(data)

        if(key == "call_component_function")
            this.ClientPacketProcess.OnCallComponentFunction(data as PacketDataComponentFunction)
    }
}