import { InputHandlerComponent } from "@phaserGame/entity/component/InputHandlerComponent";
import { RandomMovementComponent } from "@phaserGame/entity/component/RandomMovementComponent";
import { WorldTextComponent } from "@phaserGame/entity/component/WorldTextComponent";
import Entity from "@phaserGame/entity/Entity";
import GameSceneManager from "@phaserGame/game/GameSceneManager"
import LocalPlayer from "@phaserGame/game/LocalPlayer";
import Server from "@phaserGame/server/Server"

export default class World
{
    public events = new Phaser.Events.EventEmitter();

    private _id: string = ""

    private _server: Server

    private _scene?: Phaser.Scene

    private _entities: Entity[] = []

    constructor(server: Server)
    {
        this._server = server
    }

    public get id()
    {
        return this._id
    }

    public getEntities()
    {
        return this._entities
    }

    public getServer()
    {
        return this._server
    }

    public getScene()
    {
        return this._scene!
    }

    public setId(id: string)
    {
        this._id = id
    }

    public start()
    {
        this.initialize()    
    }

    private async initialize()
    {
        await this.initializeScene()
        await this.initializeListeners()
    }

    private async initializeScene()
    {
        console.log("helo")

        console.log(GameSceneManager.isHeadless)

        if(GameSceneManager.isHeadless)
        {
            var game = await GameSceneManager.createPhaserInstance()
            var scene = GameSceneManager.getSceneOfGame(game)

            this._scene = scene
        }
        else
        {
            var scene = GameSceneManager.getGame().scene.add("GameView", {}, true)

            this._scene = scene
        }
    }

    private initializeListeners()
    {
        var server = this.getServer()

        var scene = this.getScene()
        var game = scene.game

        

        game.events.on('step', (time: number, delta: number) =>
        {
            for (const entity of this._entities) entity.step(delta)
        })

        scene.events.on('update', (time: number, delta: number) =>
        {
            for (const entity of this._entities) entity.update(delta)
        })

        this.events.emit("ready")
    }

    public setupNormalWorld()
    {
        this.createEntity("EntityPlayer")
        
        for (let i = 0; i < 3; i++) {
            var bot = this.createEntity("EntityPlayer")
            bot.addComponent(new RandomMovementComponent())
            bot.getComponent(WorldTextComponent).fromData({text: `BOT ${i+1}`})
            
        }
        
    }

    public addEntity(entity: Entity)
    {
        this._entities.push(entity)

        entity.start()
    }
    
    public createControllablePlayer()
    {
        var entity = this.createEntity("EntityPlayer")
        
        //entity.getComponent(InputHandlerComponent).setControlledByPlayer(true)

        LocalPlayer.setEntity(entity)

        return entity
    }

    public createEntity(entityType: string)
    {
        console.log(`[World] createEntity (${entityType})`)

        var entity = this.getServer().getEntityFactory().createEntity(entityType, this, {})

        this.addEntity(entity)
        
        return entity
    }
}