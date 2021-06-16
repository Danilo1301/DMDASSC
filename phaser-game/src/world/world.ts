import { InputHandler, PhysicBody, Position, PositionData, TestAI, WorldText } from "@phaserGame/components";
import { EntityCrate, EntityPlayer } from "@phaserGame/entities";
import { EntityFactory } from "@phaserGame/entityFactory";
import { GameClient } from "@phaserGame/game";
import { Server } from "@phaserGame/server";
import { Entity } from "@phaserGame/utils";
import { WorldScene } from "./worldScene";

export class World extends Entity {
    public Id: string
    public Server: Server
    public EntityFactory: EntityFactory
    public Scene!: WorldScene


    public Events = new Phaser.Events.EventEmitter();

    public _test1!: Phaser.GameObjects.Arc;
    public _test2!: Phaser.GameObjects.Arc;

    constructor(server: Server, id: string) {
        super()

        this.Server = server
        this.Id = id
        this.EntityFactory = new EntityFactory(this)

        var game = this.Server.Game;

        this.Scene = game.Scene.scene.add(this.SceneKey, WorldScene, true, {world: this}) as WorldScene
        

        this.Events.on("entity_streamed_in", (entityId: string) => {
            console.log('event:entity_streamed_in', entityId)

            var game = this.Server.Game as GameClient

            if(game.Network) {
                if(game.Network.ControllingEntityId == entityId) {
                    this.Scene.cameras.main.startFollow(this.EntityFactory.GetEntity(entityId).GetComponent(PhysicBody).Sprite!)
                }
            }
        })

        this.Events.on("entity_streamed_out", (entityId: string) => {
            console.log('event:entity_streamed_out', entityId)
            
            var game = this.Server.Game as GameClient

            if(game.Network) {
                if(game.Network.ControllingEntityId == entityId) {

                    console.log("stopFollowstopFollowstopFollow")
                    this.Scene.cameras.main.stopFollow()
                }
            }
        })
        
    }

    private get SceneKey(): string { return this.Server.Id + "_" + this.Id }

    public Awake(): void {
        super.Awake()

        this.Setup()
        this.Start()
    }

    private Setup() {
        console.log(`[World] Setup`)

        var world = this;

        this.Scene.matter.world.pause()

        this.Scene.game.events.on('step', (t, d) => {
            world.Step(d)
        });
        this.Scene.events.on('preupdate', (t, d) => {
            world.PreUpdate(d)
        });
        this.Scene.events.on('update', (t, d) => {
            world.Update(d)
        });

        this._test2 = this.Scene.add.circle(0, 0, 600, 0x51204F);

        this._test1 = this.Scene.add.circle(0, 0, 0, 0x1D1A3F);

        this.Scene.tweens.add({

            targets: this._test1,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
    
        });
    }

    public CreateTest() {
        if(this.Id == "world") {
            
    
  
        }

        for (let i = 0; i < 3; i++) {
            var bot = this.CreateBot(400, 300)
        }

        for (let i = 0; i < 4; i++) {
            var crate = this.CreateCrate(400, 300)
        }

        var button = this.CreateCrate(200, 300)
        button.GetComponent(PhysicBody).FromData({spriteName: "ball"})
        button.AddComponent(new WorldText({text: 'CLICK HERE to teleport\n' + `World: ${this.Id}`}))

        
        setInterval(() => {
            var position = button.GetComponent(Position)

            if(Phaser.Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: 0, y: 0}) > 100) {
                position.Set(0, 0)
            }
        }, 300)
        
    }

    public Start(): void {
        console.log(`[World] Start`)

        this.Scene.matter.add.rectangle(0, 300, 300, 30, {isStatic: true})
        this.Scene.matter.add.rectangle(500, 380, 300, 30, {isStatic: true})
        
        

        //var player = this.EntityFactory.CreateEntity("EntityPlayer") as EntityPlayer
        //player.GetComponent(InputHandler).ControlledByPlayer = true
        //this.Scene.cameras.main.startFollow(player.GetComponent(PhysicBody).Sprite!, true, 0.5, 0.5)
        


        var matter = this.Scene.matter

        matter.world.on('collisionstart', (a, b: MatterJS.BodyType, c: MatterJS.BodyType) => {
            return;
            
            for (const pair of a.pairs) {
                console.log(pair)
            }
            console.log(a, b.id, c.id)
        })
        
    }

    public CreateCrate(x: number, y: number): EntityCrate {
        var crate = this.EntityFactory.CreateEntity("EntityCrate") as EntityCrate
        crate.GetComponent(Position).Set(x, y)
        return crate
    }

    public CreateBot(x: number, y: number): EntityPlayer {
        var bot = this.EntityFactory.CreateEntity("EntityPlayer") as EntityPlayer
        bot.GetComponent(WorldText).FromData({text: "BOT"})
        bot.GetComponent(PhysicBody).FromData({spriteName: "player2"})
        bot.GetComponent(Position).Set(x, y)
        
        bot.AddComponent(new TestAI())
        return bot
    }

    public Step(delta: number): void {
        this.Scene.matter.world.step(delta)
    }

    public PreUpdate(delta: number): void {

    }

    public Update(delta: number): void {
        super.Update(delta)

        this.EntityFactory.Update(delta)
    }
}