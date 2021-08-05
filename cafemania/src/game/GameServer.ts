import Game from "@cafemania/game/Game"
import SceneManager from "./SceneManager"
import socketio from 'socket.io';

interface Player
{
    socket: socketio.Socket
    id: string
    x: number
    y: number
}

export default class GameServer extends Game
{
    constructor(io: socketio.Namespace)
    {
        super()

        SceneManager.setHeadless(true)

        const players: Player[] = []

        const sendPlayerPosition = (player: Player) => {
            players.map(p => {
                p.socket.emit("player_data", {id: player.id, x: player.x, y: player.y})
            })
        }

        setInterval(() => {
            const todelete: Player[] = []
            
            players.map(p => {
                if(!p.socket.connected)
                {
                    todelete.push(p)
                }
            })

            todelete.map(player => {
                players.splice(players.indexOf(player), 1)

                console.log(`${player.id} deleted`)
            })
        }, 10000)

        io.on("connection", (socket) => {

            
            const player: Player = {
                socket: socket,
                id: socket.id,
                x: 0,
                y: 0
            }

            players.push(player)

            players.map(p => sendPlayerPosition(p))

            player.socket.emit("joined", {id: player.id})

            console.log("halo", player.id)

            socket.on("position", data => {
                player.x = data.x
                player.y = data.y

                console.log(data)

                players.map(p => sendPlayerPosition(p))
            })
        })
    }

    public async start(): Promise<void>
    {
        this.events.on("ready", () => {
            console.log("game server ready")
        })

        await super.start()
    }
}