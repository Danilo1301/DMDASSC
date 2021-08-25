import { Client } from '@cafemania/client/Client';
import { Game } from '@cafemania/game/Game';
import { WorldServer } from '@cafemania/world/WorldServer';
import socketio, { Socket } from 'socket.io';

//let client: Client;

export class GameServer extends Game
{
    constructor(io: socketio.Namespace)
    {
        super()

        io.on("connection", socket => this.onSocketConnect(socket))

        //client = new Client(this)
    }

    public async start(): Promise<void>
    {
        console.log('GameServer started')
    }

    private onSocketConnect(socket: Socket)
    {
        console.log(`[GameServer] New socket connected`)

        const client = new Client(this)
        client.setSocket(socket)
    }

    public createServerWorld(): WorldServer
    {
        const world = new WorldServer(this)
        return this.setupWorld(world)
    }
}