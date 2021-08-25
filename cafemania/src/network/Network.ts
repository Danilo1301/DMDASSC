import { GameClient } from "@cafemania/game/GameClient";
import { HudScene } from "@cafemania/scenes/HudScene";
import { io, Socket } from "socket.io-client";
import { Packet } from "./Packet";

export default class Network
{
    public events = new Phaser.Events.EventEmitter()

    private _socket: Socket

    private _game: GameClient

    private _address: string = ""

    constructor(game: GameClient)
    {
        this._game = game

        this._address = `${location.protocol}//${location.host}/api/cafemania`
        
        const socket = this._socket = io(this._address,
        {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        })

        socket.on("connect", this.onConnect.bind(this))
        socket.on("packets", (packets: Packet[]) => {
            packets.map(packet => this.onReceivePacket(packet))
        })

        this.events.on("DISPLAY_MESSAGE", (data: string) =>
        {
            console.log("DISPLAY_MESSAGE", data)
            HudScene.Instance.addNotification(data, 0, 0xffb0ab)
        })
    }

    private onReceivePacket(packet: Packet)
    {
        console.log(`[Network] Received packet '${packet.id}'`)

        try {
            this.events.emit(packet.id, packet.data)
        } catch (error) {
            HudScene.Instance.addNotification(`[local error] ${error}`, 0, 0xffb0ab)
            console.error(error)
        }
        
    }

    private onConnect()
    {
        console.log("Connected")
        this.events.emit("connected")
    }

    public send(id: string, data?: any)
    {
        const packet: Packet = {
            id: id,
            data: data
        }

        this.sendPacket(packet)
    }

    private sendPacket(packet: Packet)
    {
        this.getSocket().emit('packets', [packet])
    }

    public connect()
    {
        this.getSocket().connect()
    }

    private getSocket()
    {
        return this._socket
    }

    public getGame()
    {
        return this._game
    }
}