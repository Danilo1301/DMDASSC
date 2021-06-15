import { Socket } from "socket.io-client";
import { GameClient } from "@phaserGame/game/gameClient"

import { io } from "socket.io-client";
import { Server } from "@phaserGame/server";
import { Packet, PacketData, PacketDataEntity, PacketManager } from "@phaserGame/packets";
import { InputHandler, Position } from "@phaserGame/components";
import { NetworkEntity } from "@phaserGame/components/networkEntity";

export class Network {
    public Game: GameClient
    public Socket: Socket
    public Server?: Server

    public ControllingEntityId?: string

    public Settings = {
        TestDelay: 0,
        ServerAddress: `${location.protocol}//${location.host}/api/phaserGame`
    }

    public PacketManager: PacketManager

    constructor(game: GameClient) {
        var network = this

        this.Game = game

        var socket = this.Socket = io(this.Settings.ServerAddress, {
            path: '/socket',
            autoConnect: false
        })

        this.PacketManager = new PacketManager()
        this.PacketManager.SendPacketInterval = 10
        this.PacketManager.fnSendPackets = function (packets: Packet[], callback: (packets: Packet[]) => void) {
            socket.emit('packets', packets, callback)
        }


        this.PacketManager.cbOnReceiveServerPackets = function (packets: Packet[]) {
            for (const packet of packets) {
                network.OnReceivePacket(packet.Key, packet.Data)
            }
        }
      
        game.events.on("step", (time, delta) => this.Update(delta))
     
    }

    public get IsConnected(): boolean { return this.Socket.connected }

    public Update(delta: number): void {
        this.PacketManager.Update(delta)

        

        if(this.ControllingEntityId) {
            var entityFactory = this.Server!.Worlds.values()[0].EntityFactory
            var world = this.Server!.Worlds.values()[0]

            if(entityFactory.HasEntity(this.ControllingEntityId)) {
                var playerEntity = entityFactory.GetEntity(this.ControllingEntityId)
    
                var data = playerEntity.GetComponent(NetworkEntity).GetComponentsData()

                this.Send("player_data", data)
            }
        }
        
        
        
    }

    public Connect(): void {
        console.log(`[Network] Connecting to '${this.Settings.ServerAddress}'...`)
        this.Socket.connect()
    }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)

        this.PacketManager.AddPacket(packet)
    }

    public OnReceivePacket(key: string, data: PacketData): void {
        if(key == "join_server_status") {
            console.log('join_server_status', data)

            this.ControllingEntityId = data['entityId']
        }

        if(key == "entity_streamed_in") {
            console.log('entity_streamed_in', data)

            var entityData: PacketDataEntity = data['entity']
            var entity = this.Server!.Worlds.values()[0].EntityFactory.CreateEntity(entityData.Type, {Id: entityData.Id})



            var networkEntity = entity.GetComponent(NetworkEntity)
            networkEntity.SetComponentsData(entityData.ComponentsData)

            if(entity.Id == this.ControllingEntityId) {
                entity.GetComponent(InputHandler).ControlledByPlayer = true
            } else {
                networkEntity.SyncEnabled = true
            }

            


        }

        if(key == "entity_streamed_out") {
            console.log('entity_streamed_out', data)

            var entityFactory = this.Server!.Worlds.values()[0].EntityFactory;
  
            entityFactory.DestroyEntity(entityFactory.GetEntity(data['entityId']))
        }

        if(key == "entity_data") {
            var entityFactory = this.Server!.Worlds.values()[0].EntityFactory;
            var entityData: PacketDataEntity = data['entity']
            var entity = entityFactory.GetEntity(entityData.Id)

            if(entity.Id != this.ControllingEntityId) {
                entity.GetComponent(NetworkEntity).SetComponentsData(entityData.ComponentsData)
            }

            
        }
    }
}