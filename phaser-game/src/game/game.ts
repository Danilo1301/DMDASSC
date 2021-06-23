import "phaser";
import { Server } from "@phaserGame/server";
import { Entity, WorldEntity } from "@phaserGame/utils";

import { config } from "@phaserGame/game/config"
import { EntityFactory } from "@phaserGame/entityFactory";
import { ItemManager } from "@phaserGame/inventoryManager/itemManager";
import { InputHandlerComponent, InventoryComponent, PhysicBodyComponent } from "@phaserGame/components";

export class UserManager
{
    static SetupUser(player: WorldEntity)
    {
        this._entity = player

        player.GetComponent(InputHandlerComponent).ControlledByPlayer = true
 
        var camera =  player.World.Scene.cameras.main

        camera.startFollow(player.GetComponent(PhysicBodyComponent).DefaultBody!.position, false, 0.1, 0.1)
        camera.setZoom(1.5)


        var inventoryWindow = player.GetComponent(InventoryComponent).OpenInventory()
        inventoryWindow?.SetPosition(300, 480)
    }

    private static _entity?: Entity
}

export abstract class Game extends Entity {
    public IsServer: boolean = false

    private _servers = new Phaser.Structs.Map<string, Server>([])

    public get Servers(): Server[] { return this._servers.values() }
    
    public CreateServer(id: string, onlineServer: boolean = false): Server {
        console.log(`[Game] Creating Server '${id}'`)
        var server = new Server(this, id)
        server.IsOnlineServer = onlineServer
        this._servers.set(id, server)
        return server
    }
    
    public Start(): void {
        console.log(`[Game] Start`)
    }

    public OnReady() {
        console.log(`[Game] Ready`)

        EntityFactory.Setup()
        ItemManager.Setup()
    }

    public CreatePhaserInstance(headless: boolean = false) {
        if(headless) config.type = Phaser.HEADLESS

        var game = new Phaser.Game(config)

        return game
    }
}