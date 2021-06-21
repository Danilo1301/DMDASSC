import { Entity } from "@phaserGame/utils/entity";
import { Server } from "@phaserGame/server";
import { EntityManager } from "@phaserGame/entityManager";
import { GameClient } from "@phaserGame/game";
import { EntityFactory } from "@phaserGame/entityFactory";
import { PhysicBodyComponent, PositionComponent, InputHandlerComponent, RandomMovementComponent, InventoryComponent } from "@phaserGame/components";


export class World extends Entity {
    public Server: Server

    private _id: string
    private _scene?: Phaser.Scene

    public EntityManager: EntityManager

    public EntityFactory: EntityFactory

    constructor(id: string, server: Server) {
        super()

        this.Server = server
        this._id = id 

        this.EntityManager = new EntityManager()
        this.EntityManager.AddEntity(this)

        this.EntityFactory = new EntityFactory(this.EntityManager, this)
    }

    public get Scene(): Phaser.Scene { return this._scene! }

    public Init(): void {
        console.log(`[World] Init (${this.Server.Game.IsServer})`)

        if(this.Server.Game.IsServer) {
            console.log(`[World] Creating phaser...`)

            var phaserGame = this.Server.Game.CreatePhaserInstance(true)
            

   
            phaserGame.events.on("ready", () => {
                console.log(`[World] ServerGame ready`)

                var scene = this._scene = phaserGame.scene.getAt(0)!
                this.SetupListeners(phaserGame, scene)
            })
            
        } else {
            var game = this.Server.Game as GameClient
            this.SetupListeners(game.PhaserGame, game.Scene)

            this._scene = game.Scene
        }
    }

    private SetupListeners(phaserGame: Phaser.Game, scene: Phaser.Scene) {
        phaserGame.events.on("prestep", (time, delta) => this.EntityManager.PreStep(delta))
        phaserGame.events.on("step", (time, delta) => this.EntityManager.Step(delta))
        phaserGame.events.on("poststep", (time, delta) => this.EntityManager.PostStep(delta))
        
        scene.events.on("preupdate", (time, delta) => this.EntityManager.PreUpdate(delta))
        scene.events.on("update", (time, delta) => this.EntityManager.Update(delta))
        scene.events.on("postupdate", (time, delta) => this.EntityManager.PostUpdate(delta))
    }

    public SetupBaseWorld() {
        var chest = this.EntityFactory.CreateEntity("EntityChest", {autoActivate: true})
        chest.GetComponent(InventoryComponent).SetSlotItem(1, "GOOD)+ITEMID")


        for (let i = 0; i < 2; i++) {
            var bot = this.EntityFactory.CreateEntity("EntityPlayer", {autoActivate: true})
            bot.AddComponent(new RandomMovementComponent())
            bot.GetComponent(PositionComponent).Set(Math.random()*200, 100)
        }
    }

    public Start() {
        super.Start()

        var scene = this._scene!


        //y10 x14
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {

                //var block = this.EntityFactory.CreateEntity("EntityBlock", {autoActivate: true})
                //block.GetComponent(PositionComponent).Set((x - 7)*64, (y - 5)*64)
            }
        }

        
        var floorLeft = scene.matter.add.rectangle(0, 230, 500, 50, {isStatic: true})
        scene.matter.body.setAngle(floorLeft, 0.2)

        var floorRight = scene.matter.add.rectangle(700, 230, 500, 50, {isStatic: true})
        scene.matter.body.setAngle(floorRight, 1.2)


        if(this.Server.IsOnlineServer) {
            /*
            var player = this.EntityFactory.CreateEntity("EntityPlayer", {autoActivate: true})
            player.GetComponent(PositionComponent).Set(0, 50)
            player.GetComponent(InputHandlerComponent).ControlledByPlayer = true
            console.log(player)
    
            
            var camera =  this.Scene.cameras.main
            camera.startFollow(player.GetComponent(PhysicBodyComponent).DefaultBody!.position, false, 0.1, 0.1)
            

            camera.setZoom(1.5)
            */
        } else {
            this.SetupBaseWorld()
        }
        

        this.Server.Events.emit("world_start", this)

    
        
    }

    //public get Scene(): WorldScene { return this._scene! }
}


