import { EntityCrate, EntityPlayer } from "@phaserGame/entities"
import { TestAI } from "@phaserGame/game/components/testAi"
import { Entity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"
import { WorldScene } from "@phaserGame/world/worldScene"

export class EntityFactory {
    public World: World
    public Scene: WorldScene

    private _entities = new Phaser.Structs.Map<string, Entity>([])
    private _registeredEntities = new Phaser.Structs.Map<string, {new(...args: any[]): Entity }>([])
    
    constructor(world: World) {
        this.World = world
        this.Scene = this.World.Scene

        this.RegisterEntity("EntityPlayer", EntityPlayer)
        this.RegisterEntity("EntityCrate", EntityCrate)
    }

    public get Entities(): Entity[] { return this._entities.values() }

    public Update(delta: number): void {
        for (const entity of this.Entities) entity.Update(delta)
    }

    public RegisterEntity(name: string, constr: { new(...args: any[]): Entity }): void { this._registeredEntities.set(name, constr) }

    public HasEntity(id: string): boolean { return this._entities.has(id) }

    public GetEntity(id: string): Entity { return this._entities.get(id)! }

    public DestroyEntity(entity: Entity): void {
        this._entities.delete(entity.Id)
        entity.Destroy();

        this.World.Events.emit("entityDestroyed", entity)
    }

    public CreateEntity(name: string, id: string | null, options?: any, ): Entity {
        var constr = this._registeredEntities.get(name)
        if(!constr) throw Error("Unknown entity type")
        var entity = new constr(this.World, id)
        console.log(`EntityFactory.CreateEntity() - ${entity.Id}`)
        entity.Awake()
        this._entities.set(entity.Id, entity)

        this.World.Events.emit("entityCreated", entity)

        return entity
    }

    public CreateBot(x: number, y: number): EntityPlayer {
        var bot = this.CreateEntity("EntityPlayer", null) as EntityPlayer
        bot.AddComponent(new TestAI())
        bot.Position.Set(x, y)
        return bot
    }
}