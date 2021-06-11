import { Socket } from "socket.io-client";
import { GameClient } from "@phaserGame/game/gameClient"
import { Packet, PacketData, PacketEntities, PacketEntityInfo, PacketId } from "@phaserGame/server/packets";
import { InputHandler, PhysicBody, Position, SyncHelper } from "@phaserGame/game/components";

const testDelay = 0

export class Network {
    public Game: GameClient
    public Socket: Socket

    public ControllingEntityId: string = ""

    private _sendPacketsIntervalTime: number = 10
    private _lastSentPackets: number = 0
    private _canSendPackets: boolean = true
    private _now: number = 0
    private _packets: PacketData[] = []

    constructor(game: GameClient, socket: Socket) {
        this.Game = game
        this.Socket = socket

        this.Socket.on('connect', () => { console.log("Network Connected!") })

        this.Send("joinServer", {serverId: 'sla'})

        setInterval(this.Update.bind(this), 0)
    }

    public Update() {
        this._now = new Date().getTime()

        if(this._now - this._lastSentPackets >= this._sendPacketsIntervalTime && this._canSendPackets) {
            this._lastSentPackets = this._now
            var t = this._now

            //console.log(`Sending ${this._packets.length} packets`)
            this.Socket.emit("packets", this._packets, (packets: Packet[]) => {

                //console.log(`Received ${packets.length} after ${this._now - t}ms`)
                for (const packet of packets) this.OnReceivePacket(packet.Key, packet.Data)
                this._canSendPackets = true
            })
            this._packets = []
        }
    }

    public Send(key: string, data: PacketData): void {
        var packet = new Packet(key, data)
        this._packets.push(packet)
    }
    
    public OnReceivePacket(key: string, data: PacketData) {

        if(key == "connected") {
            var d = data as PacketId
            this.ControllingEntityId = d.Id
            console.log(`Controlling Entity ID ${this.ControllingEntityId}`)
        }
        
        if(key == "entities") this.OnReceivePacket_Entities(data as PacketEntities)
        if(key == "entityDestroyed") this.OnReceivePacket_EntityDestroyed(data as PacketId)
    }

    public OnReceivePacket_Entities(data: PacketEntities) {
        var world = this.Game.MainServer.Worlds.values()[0]

        for (const serverEntity of data.Entities) {
            if(!world.EntityFactory.HasEntity(serverEntity.Id)) {
                var e = world.EntityFactory.CreateEntity(serverEntity.EntityType, serverEntity.Id)

                if(this.ControllingEntityId == serverEntity.Id) {
                    e.GetComponent(InputHandler).SetControlledByPlayer(true)

                    var sprite = e.GetComponent(PhysicBody).Sprite!

                    e.Scene.cameras.main.startFollow(sprite)
                }
            }

            var entity = world.EntityFactory.GetEntity(serverEntity.Id)

            if(this.ControllingEntityId == serverEntity.Id) {
                var inputHanlder = entity.GetComponent(InputHandler)

                var packetData = new PacketEntities()
                var entityInfo = new PacketEntityInfo(entity)
                entityInfo.Inputs = inputHanlder.GetInputs()

                packetData.Entities.push(entityInfo)
         
                this.Send("client_entities", packetData)

                //--
                var netPosition = {
                    x: serverEntity.Position.X,
                    y: serverEntity.Position.Y
                }

                var position = entity.GetComponent(Position)

                var clientPosition = {
                    x: position.X,
                    y: position.Y
                }

                var distance = Phaser.Math.Distance.BetweenPoints(netPosition, clientPosition)

                //if(distance > 20) position.Set(netPosition.x, netPosition.y)
                //console.log(distance)
            } else {
                if(!entity.HasComponent(SyncHelper)) entity.AddComponent(new SyncHelper())

    
                var syncHelper = entity.GetComponent(SyncHelper)
                syncHelper.Data = serverEntity
            }
        }
    }

    public OnReceivePacket_EntityDestroyed(data: PacketId) {
        var world = this.Game.MainServer.Worlds.values()[0]
        world.EntityFactory.DestroyEntity(world.EntityFactory.GetEntity(data.Id))
    }
}