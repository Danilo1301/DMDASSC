import { PositionComponent } from "@phaserGame/components";
import { Packet, PacketData } from "@phaserGame/packets";
import { WorldEntity } from "@phaserGame/utils";
import { io, Socket } from "socket.io-client";

export class Network {
    public static Events = new Phaser.Events.EventEmitter();

    static EntityId: string = ""
    static Entity?: WorldEntity

    public static Socket: Socket
    public static Settings = {
        TestDelay: 0,
        ServerAddress: ''
    }

    private static _packets: Packet[] = []
    private static _packetsSent: number = 0
    private static _lastSentPackets: number = 0

    public static Update() {
        var limit = 5

        if(this._packetsSent > limit) return

        var now = this.GetTime()
        
        var sendInterval = 20

        var autoSend = true

        if(now - this._lastSentPackets > sendInterval && this._packets.length > 0 || autoSend) {
            this._lastSentPackets = now

            var s: string = this._packets.map((p: Packet) => p.Key).join(',')
            
            if(Network.Entity) {
                var position = Network.Entity.GetComponent(PositionComponent)

                this.Send('client_data', {
                    x: position.X,
                    y: position.Y
                })
            }

            this.Socket.emit('packets', this._packets, (packets: Packet[]) => {
                //console.log("callback")

                this._packetsSent = 0

                for (const packet of packets) this.OnReceivePacket(packet.Key, packet.Data)

            })

            //console.log(`[Network] Sending ${this._packets.length} packets (${s}) ${this._packetsSent+1}/${limit}`)
            
            this._packets = []
            this._packetsSent++
            
        }
    }

    public static OnReceivePacket(key: string, data: PacketData): void {
        //console.log(`[Network] Received ${key}`, data)

        if(key == "join_server_status") {
            this.EntityId = data['id']
        }

        if(key == "call_component_function") {
    
            var world = this.Entity!.World

            var entity = world.EntityFactory.GetEntity(data['entityId'])

            for (const component of entity.Components) {
                if(component.constructor.name == data['component']) {
                    component.OnReceiveComponentFunction(data['key'])
                }
            }
        }

        this.Events.emit("received_packet:" + key, data)


    }

    public static Setup() {
        window['Network'] = Network

        this.Settings.ServerAddress = `${location.protocol}//${location.host}/api/phaserGame`
        
        console.log(this.Settings)

        var socket = this.Socket = io(this.Settings.ServerAddress, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        })


        socket.on("connect", () => {
            console.log(`[Network] Connected`)
            this.Events.emit("connect")
        })
    }

    public static Connect(): void {
        console.log(`[Network] Connecting to '${this.Settings.ServerAddress}'...`)
        this.Socket.connect()
    }

    public static Send(key: string, data: PacketData) {
        var packet = new Packet(key, data)

        this._packets.push(packet)
    }

    private static GetTime() {
        return new Date().getTime()
    }
}