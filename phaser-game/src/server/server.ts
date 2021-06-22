import { Client } from "@phaserGame/client";
import { WorldTextComponent } from "@phaserGame/components";
import { Game } from "@phaserGame/game";
import { Network } from "@phaserGame/network";
import { PacketDataComponentFunction } from "@phaserGame/packets";
import { ComponentFunctionData } from "@phaserGame/utils";
import { World } from "@phaserGame/world";


export class Server
{
    public Game: Game

    public IsOnlineServer: boolean = false

    public Events = new Phaser.Events.EventEmitter();

    private _id: string

    private _worlds = new Phaser.Structs.Map<string, World>([])

    //x
    public _clients = new Phaser.Structs.Map<string, Client>([])

    public get Worlds(): World[] { return this._worlds.values() }

    constructor(game: Game, id: string)
    {
        this.Game = game

        this._id = id 

        console.log(this.Id, this.Game.IsServer)

        this.Events.on("call_component_function", (cfData: ComponentFunctionData) =>
        {
            console.log("call_component_function", cfData)

            const data = cfData.Data

            const clientId: string | undefined = data.id

            const isLocalClient = Network.Entity != undefined

            var packet: PacketDataComponentFunction = {
                Data: cfData
            }


            if(clientId)
            {
                data.id = undefined

                this._clients.get(clientId).Send("call_component_function", packet)
                return
            }

            if(isLocalClient)
            {
                Network.Send("call_component_function", packet)
            }
            else
            {
                var world = this.Worlds[0]

                var entity = world.EntityFactory.GetEntity(cfData.EntityId)

                for (const component of entity.Components)
                {
                    if(component.constructor.name == cfData.ComponentName)
                    {
                        component.OnReceiveFunction(cfData.Key, data)
                    }
                }
            }
        })
    }

    public get Id(): string { return this._id }

    public Start(): void
    {
        console.log(`[Server] Start`)

        var world = this.CreateWorld('world')

        world.Init()
    }

    public CreateWorld(id: string): World
    {
        console.log(`[Server] Creating world '${id}'`)

        var world = new World(id, this)

        this._worlds.set(id, world)
        
        return world
    }

    public HandleClientConnection(client: Client)
    {
        //if can
        var world = this.Worlds[0]
        
        var entity = world.EntityFactory.CreateEntity("EntityPlayer", {autoActivate: true})
        entity.AddComponent(new WorldTextComponent({text: client.Id}))

        this._clients.set(client.Id, client)

        client.Server = this
        client.WorldIndex = 0
        client.Entity = entity
        client.Send("join_server_status", {joined: true, id: entity.Id})

        this.OnClientJoin(client)
    }

    public OnClientJoin(client: Client)
    {
        
    }

    public OnClientLeave(client: Client)
    {
        
    }
}


