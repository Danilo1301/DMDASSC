import { Socket } from "socket.io-client";
import { GameClient } from "@phaserGame/game/gameClient"
import { Packet, PacketData, PacketEntities, PacketEntityInfo } from "@phaserGame/server/packets";
import { InputHandler, Position } from "@phaserGame/game/components";
import { EntityPlayer } from "@phaserGame/entities";
import { SyncHelper } from "@phaserGame/game/components/syncHelper";

const testDelay = 1

export class Network {
    public Game: GameClient
    public Socket: Socket

    public ControllingEntityId: string = ""

    private _sendPacketsIntervalTime: number = 30
    private _lastSentPackets: number = 0
    private _canSendPackets: boolean = true
    private _now: number = 0
    private _packets: PacketData[] = []

    constructor(game: GameClient, socket: Socket) {
        this.Game = game
        this.Socket = socket

        this.Socket.on('connect', () => {
            console.log("Network Connected!")
        })

        this.Send("joinServer", {serverId: 'sla'})

        setInterval(() => {
            this._now = new Date().getTime()

            if(this._now - this._lastSentPackets >= this._sendPacketsIntervalTime && this._canSendPackets) {
                this._lastSentPackets = this._now
                this._canSendPackets = false



                setTimeout(() => {
                    //console.log(`Sending ${this._packets.length} packets`, this._packets)

                    this.Socket.emit("packets", this._packets, (packets: Packet[]) => {

                        //console.log(`Received ${packets.length} after ${this._now - this._lastSentPackets}ms`)
                        for (const packet of packets) this.OnReceivePacket(packet)

                        this._canSendPackets = true
                    })

                    this._packets = []
                }, testDelay)
                

                
            }
        }, 1)
    }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)

        this._packets.push(packet)
    }
    
    public OnReceivePacket(packet: Packet) {
        //console.log(`Received Packet`, packet.Key)

        if(packet.Key == "connected") {
            console.log(packet)

            this.ControllingEntityId = packet.Data['entityId']
        }

        if(packet.Key == "entities") {
            var data = packet.Data as PacketEntities

            var world = this.Game.MainServer.Worlds.values()[0]

            for (const serverEntity of data.Entities) {
                if(!world.EntityFactory.HasEntity(serverEntity.Id)) {
                    var e = world.EntityFactory.CreateEntity(serverEntity.EntityType, serverEntity.Id)

                    if(this.ControllingEntityId == serverEntity.Id) {
                        e.GetComponent(InputHandler).SetControlledByPlayer(true)
                    }
                }

                var entity = world.EntityFactory.GetEntity(serverEntity.Id)
                var position = entity.GetComponent(Position)

                if(this.ControllingEntityId == serverEntity.Id) {

                    var inputHanlder = entity.GetComponent(InputHandler)

                    var packetData = new PacketEntities()
                    var entityInfo = new PacketEntityInfo(entity)
                    entityInfo.Inputs = inputHanlder.GetInputs()

                    
                    packetData.Entities.push(entityInfo)
             
                    this.Send("client_entities", packetData)
                } else {
                    if(!entity.HasComponent(SyncHelper)) {
                        entity.AddComponent(new SyncHelper())
                    }

                    var syncHelper = entity.GetComponent(SyncHelper)
                    syncHelper.Position.X = serverEntity.Position.X
                    syncHelper.Position.Y = serverEntity.Position.Y
                }

                
            }
        }
    }
}