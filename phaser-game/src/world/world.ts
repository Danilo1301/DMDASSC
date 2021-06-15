import { InputHandler, PhysicBody, PositionData, TestAI } from "@phaserGame/components";
import { EntityCrate, EntityPlayer } from "@phaserGame/entities";
import { EntityFactory } from "@phaserGame/entityFactory";
import { Server } from "@phaserGame/server";
import { Entity } from "@phaserGame/utils";
import { WorldScene } from "./worldScene";

export class World extends Entity {
    public Id: string
    public Server: Server
    public EntityFactory: EntityFactory
    public Scene!: WorldScene

    public Events = new Phaser.Events.EventEmitter();

    constructor(server: Server, id: string) {
        super()

        this.Server = server
        this.Id = id
        this.EntityFactory = new EntityFactory(this)

        var game = this.Server.Game;

        this.Scene = game.Scene.scene.add(this.SceneKey, WorldScene, true, {world: this}) as WorldScene
        


        
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
    }

    public CreateTest() {
        

        for (let i = 0; i < 4; i++) {
            var crate = this.CreateCrate(0, 0)
        }

        for (let i = 0; i < 2; i++) {
            var bot = this.EntityFactory.CreateEntity("EntityPlayer") as EntityPlayer
            bot.GetComponent(PhysicBody).FromData({spriteName: "player2"})
            bot.AddComponent(new TestAI())

            console.log("bot", bot)
        }
        
    }

    public Start(): void {
        console.log(`[World] Start`)

        this.Scene.matter.add.rectangle(0, 300, 300, 30, {isStatic: true})
        
        

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
        return crate
    }

    public CreateBot(x: number, y: number): EntityPlayer {
        var bot = this.EntityFactory.CreateEntity("EntityPlayer", {components: {
            'TestAI': {}
        }}) as EntityPlayer

        bot.Awake()

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