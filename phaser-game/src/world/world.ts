import { EntityPlayer } from "@phaserGame/entities";
import { EntityFactory } from "@phaserGame/entityFactory";
import { GameClient } from "@phaserGame/game";
import { PhysicBody } from "@phaserGame/game/components";
import { TestAI } from "@phaserGame/game/components/testAi";
import { Server } from "@phaserGame/server";
import { PacketData, PacketId } from "@phaserGame/server/packets";
import { Entity } from "@phaserGame/utils";
import { BodyType } from "matter";
import { WorldScene } from "./worldScene";

export class World {
    public Server: Server
    public EntityFactory: EntityFactory

    public Events = new Phaser.Events.EventEmitter();

    private _id: string;
    private _scene!: WorldScene;

    constructor(server: Server, id: string) {
        this.Server = server
        this._id = id
        this.EntityFactory = new EntityFactory(this)

        this.Events.on("entityCreated", (entity: Entity) => {
            console.log("[World Event] New entity", entity.Id)
        })
    }

    public get Id(): string { return this._id }
    public get Scene(): WorldScene { return this._scene }

    private get SceneKey(): string { return this.Server.Id + "_" + this.Id }

    public Start(): void {
        console.log(`World.Start()`)

        this.SetupScene()

        this.Scene.matter.add.rectangle(100, 200, 40, 500, {isStatic: true, restitution: 0.5})
        this.Scene.matter.add.rectangle(700, 200, 40, 500, {isStatic: true, restitution: 0.5})
        
        this.Scene.matter.add.rectangle(500, 600, 1200, 200, {isStatic: true, restitution: 0.5})
        this.Scene.matter.add.rectangle(500, -100, 1200, 200, {isStatic: true, restitution: 0.5})

        this.Scene.add.text(300, 200, "Spawn ball")
        var ballSensor = this.Scene.matter.add.rectangle(300, 200, 30, 30, {isSensor: true})

        this.Scene.add.text(500, 200, "Spawn bot")
        var botSensor = this.Scene.matter.add.rectangle(500, 200, 30, 30, {isSensor: true})
        
        var world = this

        this.Scene.matter.world.on('collisionstart', function (event, bodyA: BodyType, bodyB: BodyType) {
            var isCollidingBall = bodyA == ballSensor || bodyB == ballSensor
            var isCollidingBot = bodyA == botSensor || bodyB == botSensor
            

            var game = world.Server.Game as GameClient

            if(!game.Network) return

            

            
            var id = game.Network.ControllingEntityId
            var player = world.EntityFactory.GetEntity(id) as EntityPlayer
            var body = player.PhysicBody.Sprite?.body as BodyType
            

            var ids: number[] = []

            for (const p of body.parts) {
                ids.push(p.id)
            }

            var collidingWithPlayer = ids.includes(bodyA.id) || ids.includes(bodyB.id)


            if(collidingWithPlayer) {
   
                if(isCollidingBall) {
                    game.Network.Send("newBall", new PacketId(''))
                }

                if(isCollidingBot) {
                    game.Network.Send("newBot", new PacketId(''))
                }
            }
        });

    }

    public Preload(): void {
        console.log(`World.Preload()`)

        var load = this.Scene.load;

        load.setPath(this.Server.Game.ASSETS_PATH)
        load.image('ball', 'ball.png')
        load.image('player1', 'player1.png')
        load.image('player2', 'player2.png')
        load.image('block1', 'block1.png')
        load.image('block2', 'block2.png')
    }

    public Create(): void {
        console.log(`World.Create()`)
    }

    private SetupScene(): void {
        this._scene = this.Server.Game.scene.add(this.SceneKey, WorldScene) as WorldScene
        this._scene.World = this
        this.Server.Game.scene.start(this.SceneKey)
        this.EntityFactory.Scene = this._scene
    }

    public Update(delta: number): void {
        this.EntityFactory.Update(delta)
    }
}