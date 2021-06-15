import { Packet } from "@phaserGame/packets"

export class PacketManager {
    public SendPacketInterval: number = 0

    private _packets: Packet[] = []
    private _lastSentPackets: number = 0
    private _packetsSent: number = 0

    public AutoSend: boolean = true

    public fnSendPackets?: (packets: Packet[], callback:  (packets: Packet[]) => void  ) => void;

    public cbOnReceiveServerPackets?: (packets: Packet[]) => void;

    constructor() {
        
    }

    public fnOnReceivePackets(packets: Packet[], callback: (packets: Packet[]) => void) {
        callback(this._packets)
        this._packets = []
    }

    public Update(delta: number): void {
        var now = this.GetTime()

        if(now - this._lastSentPackets >= this.SendPacketInterval && this.AutoSend) {
            this.SendAllPackets()
        }
    }

    private SendAllPackets(): void {
        var now = this.GetTime()

        this._lastSentPackets = now

        var limit = 5

        if(this._packetsSent > limit) return

        var s: string = this._packets.map((p: Packet) => p.Key).join(',')

        //console.log(`[PacketManager] Sending ${this._packets.length} packets (${s}) ${this._packetsSent}/${limit}`)

        this._packetsSent++

        this.fnSendPackets!(this._packets, (packets: Packet[]) => {
            this._packetsSent = 0

            if(this.cbOnReceiveServerPackets) this.cbOnReceiveServerPackets(packets)
        })

        this._packets = []
    }

    private GetTime() {
        return new Date().getTime()
    }

    public AddPacket(packet: Packet): void {
        this._packets.push(packet)
    }
}