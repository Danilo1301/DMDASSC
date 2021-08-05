import Player from "@cafemania/player/Player"
import { io, Socket } from "socket.io-client"

interface IPlayerData
{
    id: string
    x: number
    y: number
}

export default class TestMultiplayer
{
    private socket: Socket

    public onCreatePlayer?: (data: IPlayerData) => any
    public onUpdatePlayer?: (player: any, data: IPlayerData) => any

    private players = new Map<string, any>()

    constructor(url: string)
    {
        var address = `${location.protocol}//${location.host}/api/cafemania`

        var socket = this.socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        })


        socket.on("connect", () => {

            //alert("ok")
            console.log("YES")
        })

        socket.on("joined", (data) => {
            console.log(data)
        })

        socket.on("player_data", (data: IPlayerData) => {

            

            if(!this.players.has(data.id))
            {
                if(!this.onCreatePlayer) return

                const player = this.onCreatePlayer(data)

                this.players.set(data.id, player)
            }
            
            this.onUpdatePlayer?.(this.players.get(data.id), data)

            console.log(data)
            console.log(this)
        })

        socket.connect()

        console.log("???", address)
        
    }

    public send(key: string, data)
    {
        this.socket.emit(key, data)
    }
}