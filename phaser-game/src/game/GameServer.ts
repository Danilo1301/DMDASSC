import Game from "@phaserGame/game/Game";
import GameSceneManager from "./GameSceneManager";
import socketio from 'socket.io';
import PacketSender from "@phaserGame/network/PacketSender";
import Client from "@phaserGame/network/Client";

export default class GameServer extends Game
{
    constructor(io: socketio.Namespace)
    {
        super()

        io.on("connection", (socket) => {

            var client = new Client(this, socket)
        })
        
        GameSceneManager.setHeadless(true)

        this.events.once("ready", () => {
            var server = this.createServer('server')

            server.events.on("ready", () => {
                var world = server.createWorld('world')

                world.events.once("ready", () => {
                    world.setupNormalWorld()
                })

                world.start()
            })

            server.start()
        })
    }
}