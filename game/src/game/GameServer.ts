import { Game } from "@game/game/Game";
import { Client } from "@game/server/Client";
import socketio from 'socket.io';

export class GameServer extends Game {

    constructor(io: socketio.Namespace) {
        super();

        io.on("connection", (socket) => {

            var client = new Client(this, socket);
        })
    }

    public async start() {
        console.log(`[GameServer] Start`);

        //change
        setInterval(() => {
            this.updateServers(16);
        }, 16);

        const server = this.createServer();
        server.start();
        
        const world = server.createWorld();

        world.events.on('ready', () => {
            console.log('[GameServer] World loaded');

            world.setupBaseWorld();
        });

        world.start();


        
    }
}