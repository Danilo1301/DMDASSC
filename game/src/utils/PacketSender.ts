import socketio from 'socket.io';

import { io, Socket } from "socket.io-client";

export class Packet
{
    key: string
    data: any

    constructor(key, data)
    {
        this.key = key
        this.data = data
    }
}

export class PacketSender {
    private _socket: Socket

    public events = new Phaser.Events.EventEmitter();

    constructor(s: any)
    {
        this._socket = s

        var socket = this.getSocket()

        socket.on("packets", (packets: Packet[]) =>
        {
            for (const packet of packets)
            {
                this.events.emit("RECEIVED_PACKET:" + packet.key, packet.data)
                this.events.emit('RECEIVED_PACKET', packet)
            }

            //console.log("received packets", packets)
        })
    }

    public sendPackets(packets: Packet[])
    {
        this.getSocket().emit("packets", packets);

        //console.log("sending packets", packets)
    }

    public send(key: string, data: any)
    {
        var packet = new Packet(key, data)

        this.sendPackets([packet])
    }

    public getSocket()
    {
        return this._socket
    }
}