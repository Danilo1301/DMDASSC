import "phaser";
import Server from "@phaserGame/server/Server";
import GameSceneManager from "@phaserGame/game/GameSceneManager";
import PluginManager from "@phaserGame/server/PluginManager";
import InputManager from "./InputManager";

export default class Game
{
    public events = new Phaser.Events.EventEmitter();

    private _servers = new Phaser.Structs.Map<string, Server>([])

    private _hasLoaded: boolean = false

    private _inputManager: InputManager

    constructor()
    {
        this._inputManager = new InputManager()
    }

    public getInputManager()
    {
        return this._inputManager
    }

    public start()
    {
        this.initialize()
    }

    public getServers()
    {
        return this._servers.values()
    }

    public getServer(id: string)
    {
        return this._servers.get(id)
    }

    private async initialize()
    {
        await GameSceneManager.createPhaserInstance()

        this.initializeInputManager()

        PluginManager.initializate()

        this.initializeGameLoop()
    }

    private initializeInputManager()
    {
        var scene = GameSceneManager.getScene()

        this._inputManager.initialize(scene.input)
    }


    private initializeGameLoop()
    {
        var game = GameSceneManager.getGame()
        var scene = GameSceneManager.getScene()

        game.events.on("prestep", (time, delta) => this.events.emit('prestep', delta))
        game.events.on("step", (time, delta) => this.events.emit('step', delta))
        game.events.on("poststep", (time, delta) => this.events.emit('poststep', delta))
        
        scene.events.on("preupdate", (time, delta) => this.events.emit('preupdate', delta))
        scene.events.on("update", (time, delta) => this.events.emit('update', delta))
        scene.events.on("postupdate", (time, delta) => this.events.emit('postupdate', delta))

        this._hasLoaded = true

        this.startServers()

        this.events.emit("ready")
    }

    public createServer(id: string): Server
    {
        var server = new Server(this)

        server.setId(id)

        this._servers.set(id, server)

        return server
    }

    public hasLoaded()
    {
        return this._hasLoaded
    }

    public startServers()
    {
        for (const server of this._servers.values())
        {
            if(!server.hasStarted()) server.start()
        }
    }
}