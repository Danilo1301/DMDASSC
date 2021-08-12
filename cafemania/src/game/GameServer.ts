import Game from "@cafemania/game/Game"
import SceneManager from "./SceneManager"
import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

class Client
{
    private _socket: socketio.Socket
    private _id: string

    constructor(socket: socketio.Socket)
    {
        this._socket = socket
        this._id = uuidv4()

        this.setupSocket()
    }

    public get id(): string { return this._id }

    private setupSocket()
    {
        const socket = this.getSocket()

        
    }

    public getSocket()
    {
        return this._socket
    }

    public sendPacket(key: string, data: any)
    {
        this.getSocket().emit("packet", {id: key, packetData: data})
    }
}

export default class GameServer extends Game
{
    private _clients = new Phaser.Structs.Map<string, Client>([])

    private _io: socketio.Namespace

    constructor(io: socketio.Namespace)
    {
        super()

        this._io = io

        SceneManager.setHeadless(true)
    }

    public async start(): Promise<void>
    {
        this.events.on("ready", this.initServer.bind(this))

        await super.start()
    }

    public async initServer()
    {
        console.log("game server ready")

        console.log(`Create world`)

        const tickInterval = 1

        setInterval(() => {
            this.getWorlds().map(world => world.update(16))
        }, tickInterval);

        const world = this.createServerWorld()

        this._io.on("connection", (socket) => {
            const world = this.getWorlds()[0]
            const client = this.createClient(socket)
            
            console.log(client.id, 'new client')

            const packetData = {
                tiles: {},
                players: {}
            }

            for (const tile of world.getTiles()) {
                packetData.tiles[tile.id] = tile.serialize()
            }


            client.sendPacket("data", packetData)
        })

        setInterval(() => {
            this.sendPlayersData()
        }, 1000)
    }

    public sendPlayersData()
    {
        const world = this.getWorlds()[0]

        const packetData = {
            players: {}
        }

        for (const player of world.getPlayers()) {
            packetData.players[player.id] = player.serialize()
        }

        this.getClients().map(client => client.sendPacket("data", packetData))

        
    }

    public getClients()
    {
        return this._clients.values()
    }

    public createClient(socket: socketio.Socket)
    {
        const client = new Client(socket)

        this._clients.set(client.id, client)

        return client
    }
}