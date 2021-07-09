import PositionComponent from "@phaserGame/entity/component/PositionComponent";
import { WorldTextComponent } from "@phaserGame/entity/component/WorldTextComponent";
import EntityFactory from "@phaserGame/entity/EntityFactory";
import EntityPlayer from "@phaserGame/entity/EntityPlayer";
import Game from "@phaserGame/game/Game"
import GameClient from "@phaserGame/game/GameClient";
import GameSceneManager from "@phaserGame/game/GameSceneManager";
import InventoryManager from "@phaserGame/inventory/InventoryManager";
import Client from "@phaserGame/network/Client";
import World from "@phaserGame/world/World";
import { cli } from "webpack";
import PluginManager from "./PluginManager";

export default class Server
{
    public events = new Phaser.Events.EventEmitter();

    private _game: Game

    private _worlds = new Phaser.Structs.Map<string, World>([])

    private _clients = new Phaser.Structs.Map<string, Client>([])

    private _hasStarted: boolean = false

    private _id: string = ""

    private _entityFactory: EntityFactory

    private _inventoryManager: InventoryManager

    public isMultiplayerServer: boolean = false

    constructor(game: Game)
    {
        this._game = game

        this._entityFactory = new EntityFactory(this)

        var entityFactory = this.getEntityFactory()

        entityFactory.registerEntity("EntityPlayer", EntityPlayer)
        entityFactory.registerComponent("PositionComponent", PositionComponent)

        this._inventoryManager = new InventoryManager()

        this.events.on("REQUEST_ACTION", (action: string, data: any, clientId: string) =>
        {
            console.log("REQUEST_ACTION: ", action, this.isMultiplayerServer, clientId)

            if(this.isMultiplayerServer)
            {
                console.log("REQUEST_ACTION: Send to network...")

                var game = this._game as GameClient

                game.getNetwork().send("REQUEST_ACTION", {action: action, data: data})

                return
            }

            if(GameSceneManager.isHeadless)
            {
                this._clients.get(clientId).send("PERFORM_ACTION", {action: action, data: data})
            } else {
                this.events.emit("PERFORM_ACTION:" + action, data)
            }

            
        })

        this.events.on("PERFORM_ACTION:OPEN_INVENTORY", () => {
            console.log("PERFORM_ACTION: open inventory yeas")
        })
    }

    public getGame() {
        return this._game
    }

    public getClients()
    {
        return this._clients.values()
    }

    public start()
    {
        this._hasStarted = true

        this.initializeListeners()

        if(GameSceneManager.isHeadless)
        {
            //var inventory = this._inventoryManager.createInventory('INVENTORY_1', 8)
            //console.log(inventory.getSlots())
        } else {
            this.events.emit("REQUEST_ACTION", "OPEN_INVENTORY", {inventoryId: "idk"})
        }
        
        if(!GameSceneManager.isHeadless)
        {
            var code = `
                class MyPlugin {
                    onLoad()
                    {
                        console.log(this.server)
                    }
                }

                game._servers.values()[0].loadPlugin(new MyPlugin())
            `


            eval(code)
        }

        //this.createWorld("world")

        this.events.emit("ready")
    }

    public simulate()
    {
        


        //this._inventoryManager.openInventory('INVENTORY_1')
    }

    public getWorlds()
    {
        return this._worlds.values()
    }

    public loadPlugin(plugin: any)
    {
        
        plugin.server = PluginManager.objectfyClass(this)
        plugin.onLoad()

        window['plugin'] = plugin
    }

    public get id()
    {
        return this._id
    }

    public getEntityFactory()
    {
        return this._entityFactory
    }

    private initializeListeners()
    {
        //var game = this._game

        //game.events.on("update", (time, delta) => this.events.emit('update', delta))
    }

    public hasStarted()
    {
        return this._hasStarted
    }

    public setId(id: string)
    {
        this._id = id
    }

    public createWorld(id: string): World
    {
        var world = new World(this)

        world.setId(id)

        this._worlds.set(id, world)

        return world
    }

    public handleClientConnection(client: Client) {

        if(this._clients.has(client.id))
        {
            client.send("JOIN_SERVER_STATUS", {success: false})
            return
        }

        this._clients.set(client.id, client)

        var world = this.getWorlds()[0]

        var entity = world.createEntity("EntityPlayer")

        entity.getComponent(WorldTextComponent).fromData({text: `${client.id}`})
        
        client.send("JOIN_SERVER_STATUS", {success: true, entityId: entity.id})

        
        
        client.setEntity(entity)

    }

    public handleClientDisconnect(client: Client) {
        this._clients.delete(client.id)
    }
}