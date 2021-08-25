import { GameClient } from "@cafemania/game/GameClient";
import { io, Socket } from "socket.io-client";

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
    }

    private onConnect()
    {
        console.log("Connected")
        this.events.emit("connected")
    }

    public emit(key: string, data?: any)
    {
        this.getSocket().emit(key, data)
    }

    public connect()
    {
        this.getSocket().connect()
    }

    public getSocket()
    {
        return this._socket
    }

    public getGame()
    {
        return this._game
    }
}