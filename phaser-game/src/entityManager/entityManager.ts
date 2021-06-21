import { Game } from "@phaserGame/game"
import { Entity } from "@phaserGame/utils/entity"

export class EntityManager {
    //public Game: Game

    private _entities: Entity[] = []

    public get Entities(): Entity[] { return this._entities }

    constructor() {
        //this.Game = game
    }

    public PreStep(delta: number): void {
        for (const entity of this._entities) entity.PreStep(delta)
    }

    public Step(delta: number): void {
        for (const entity of this._entities) entity.Step(delta)
    }

    public PostStep(delta: number): void {
        for (const entity of this._entities) entity.PostStep(delta)
    }

    public PreUpdate(delta: number): void {
        var entities: Entity[] = []

        for (const e of this.Entities) {
            entities.push(e)
        }

        for (const entity of entities) {
            this.AwakeEntity(entity)
        }

        for (const entity of entities) {
            this.StartEntity(entity)

        }
        
        for (const entity of entities) entity.PreUpdate(delta)
    }

    public ActivateEntity(entity: Entity) {
        this.AwakeEntity(entity)
        this.StartEntity(entity)
    }

    private AwakeEntity(entity: Entity) {
        if(!entity.HasAwaken) {
            console.log(`[EntityManager] ${entity.constructor.name} Awake`)
            entity.Awake()
        }
    }

    private StartEntity(entity: Entity) {
        if(!entity.HasStarted) {
            console.log(`[EntityManager] ${entity.constructor.name} Start`)
            entity.Start()
        }
    }

    public Update(delta: number): void {
        for (const entity of this._entities) entity.Update(delta)
    }

    public PostUpdate(delta: number): void {
        for (const entity of this._entities) entity.PostUpdate(delta)
    }

    public AddEntity(entity: Entity) {
        //entity.Game = this.Game

        this._entities.push(entity)

        console.log(`[EntityManager] Entity ${entity.constructor.name} added`)
    }

    public RemoveEntity(entity: Entity) {
        //entity.Game = this.Game

        if(this._entities.includes(entity)) this._entities.splice(this._entities.indexOf(entity), 1)

        console.log(`[EntityManager] Entity ${entity.constructor.name} removed`)
    }
}