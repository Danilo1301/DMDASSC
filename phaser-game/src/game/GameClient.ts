import Game from "@phaserGame/game/Game";
import Network from "@phaserGame/network/Network";
import PacketSender from "@phaserGame/network/PacketSender";

import { io, Socket } from "socket.io-client";
import GameSceneManager from "./GameSceneManager";
import MainLoadScene from "./scene/MainLoadScene";
import MainMenuScene from "./scene/MainMenuScene";
import ServersScene from "./scene/ServersScene";

export default class GameClient extends Game
{
    private _network: Network

    constructor()
    {
        super()

        this._network = new Network(this)

        this.events.once("ready", () => {
            
            this._network.initialize()

            this.startLoadScene()
        })
    }

    public getNetwork()
    {
        return this._network
    }

    public start()
    {
        super.start()
    }

    public startLoadScene()
    {
        GameSceneManager.getGame().scene.add('MainLoadScene', MainLoadScene, true, {game: this})

    }

    public startMainMenuScene()
    {
        GameSceneManager.getGame().scene.add('MainMenuScene', MainMenuScene, true, {game: this})
    }



    public startMultiplayerWorld()
    {
        var server = this.createServer('server')
        server.isMultiplayerServer = true

        server.events.once("ready", () => {
            var world = server.createWorld('world')

            world.events.once("ready", () => {

            })
        
            world.start()
        })
        
        server.start()
    }

    public startMultiplayer()
    {
        GameSceneManager.getGame().scene.add('ServersScene', ServersScene, true, {game: this})

        
    }

    public startSinglePlayer()
    {
        var server = this.createServer('server')

        server.events.on("ready", () => {
            var world = server.createWorld('world')

            world.events.once("ready", () => {
                world.setupNormalWorld()
            })

            world.start()
        })

        server.start()
    }
}