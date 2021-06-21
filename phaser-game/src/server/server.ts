import { Client } from "@phaserGame/client";
import { EntityManager } from "@phaserGame/entityManager/entityManager";
import { Game } from "@phaserGame/game";
import { Network } from "@phaserGame/network";
import { Entity } from "@phaserGame/utils";
import { World } from "@phaserGame/world";


export class Server {
    public Game: Game

    public IsOnlineServer: boolean = false

    private _id: string
    private _worlds = new Phaser.Structs.Map<string, World>([])
    public get Worlds(): World[] { return this._worlds.values() }

    public Events = new Phaser.Events.EventEmitter();

    public _clients = new Phaser.Structs.Map<string, Client>([])

    constructor(game: Game, id: string) {
        this.Game = game
        this._id = id 

        console.log(this.Id, this.Game.IsServer)

        this.Events.on("call_component_function", (data) => {
            console.log("call_component_function", data)

            if(data.id) {

                this._clients.get(data.id).Send("call_component_function", data)

                console.log("RETURN TO CLIENT", data)
                return
            }

            if(Network.Entity) {
                Network.Send("call_component_function", data)
            } else {
                var world = this.Worlds[0]

                var entity = world.EntityFactory.GetEntity(data['entityId'])

                for (const component of entity.Components) {
                    if(component.constructor.name == data['component']) {
                        component.OnReceiveComponentFunction(data['key'])
                    }
                }

            }
        })
    }

    public get Id(): string { return this._id }

    public Start(): void {
        console.log(`[Server] Start`)

        var world = this.CreateWorld('world')
        world.Init()
    }

    public CreateWorld(id: string): World {
        console.log(`[Server] Creating world '${id}'`)

        var world = new World(id, this)
        this._worlds.set(id, world)
        return world
    }
}


