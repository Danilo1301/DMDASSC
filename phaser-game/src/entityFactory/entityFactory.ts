import { InputHandler, PhysicBody, Position, TestAI } from "@phaserGame/components"
import { EntityCrate, EntityPlayer } from "@phaserGame/entities"
import { Component, Entity, WorldEntity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"
import { WorldScene } from "@phaserGame/world/worldScene"
import { Math } from "phaser"

import { v4 as uuidv4 } from 'uuid';

interface ICreateEntityOptions {
    Id?: string
    components?: { [key: string]: any; }
}

export class EntityFactory {
    public World: World
    public Scene: WorldScene

    private _entities = new Phaser.Structs.Map<string, WorldEntity>([])
    private _registeredEntities = new Phaser.Structs.Map<string, {new(...args: any[]): WorldEntity }>([])
    private _registeredComponents = new Phaser.Structs.Map<string, {new(...args: any[]): Component }>([])
    private _activeEntities = new Phaser.Structs.Map<string, WorldEntity>([])
    
    constructor(world: World) {
        this.World = world
        this.Scene = this.World.Scene

        this.RegisterEntity("EntityPlayer", EntityPlayer)
        this.RegisterEntity("EntityCrate", EntityCrate)
        
        this.RegisterComponent("Position", Position)
        this.RegisterComponent("PhysicBody", PhysicBody)
        this.RegisterComponent("InputHandler", InputHandler)
        this.RegisterComponent("TestAI", TestAI)
    }

    public get Entities(): WorldEntity[] { return this._entities.values() }
    public get ActiveEntities(): WorldEntity[] { return this._activeEntities.values() }

    public DeactivateEntity(entity: WorldEntity): void {
        if(this._activeEntities.has(entity.Id)) {
            console.log("[EntityFactory] Deactivate Entity " + entity.Id)

            this._activeEntities.delete(entity.Id)
            entity.Destroy()

            this.World.Events.emit("entity_streamed_out", entity.Id)
        }
    }

    public ActivateEntity(entity: WorldEntity): void {
        if(!this._activeEntities.has(entity.Id)) {
            console.log("[EntityFactory] Activate Entity " + entity.Id)

            this._activeEntities.set(entity.Id, entity)
            entity.Awake()


            this.World.Events.emit("entity_streamed_in", entity.Id)
        }
    }

    public Update(delta: number): void {
  
        for (const entity of this.Entities) {
            
            
            this.ActivateEntity(entity)

            
            var position = entity.GetComponent(Position)

            var d = Math.Distance.BetweenPoints({x: position.X, y: position.Y}, {x: 400, y: 300})

            if(d > 400) {

                position.Set(400, 300)

                //this.DeactivateEntity(entity)
            } else {
                //this.ActivateEntity(entity)
            }
            
            


        }

        for (const entity of this.ActiveEntities) entity.Update(delta)
        
    }

    public RegisterEntity(name: string, constr: { new(...args: any[]): WorldEntity }): void { this._registeredEntities.set(name, constr) }
    public RegisterComponent(name: string, constr: { new(...args: any[]): Component }): void { this._registeredComponents.set(name, constr) }

    public HasEntity(id: string): boolean { return this._entities.has(id) }

    public GetEntity(id: string): WorldEntity { return this._entities.get(id)! }

    public DestroyEntity(entity: WorldEntity): void {
        this._entities.delete(entity.Id)
        this._activeEntities.delete(entity.Id)
        entity.Destroy();

        this.World.Events.emit("entityDestroyed", entity)
    }

    public CreateEntity(name: string, options?: ICreateEntityOptions): WorldEntity {
        var constr = this._registeredEntities.get(name)
        if(!constr) throw Error("Unknown entity type")
        var entity = new constr(this.World)
        entity.Id = options?.Id || uuidv4()
        console.log(`[EntityFactory] CreateEntity ${entity.Id}`)
        this._entities.set(entity.Id, entity)


        if(options) {
            for (const componentName in options.components) {
                var data = options.components[componentName]
                var component_construct = this._registeredComponents.get(componentName)
                if(!component_construct) throw Error("Unknown component type")

                if(!entity.HasComponent(component_construct)) entity.AddComponent(new component_construct())
                var c = entity.GetComponent(component_construct)

                c.FromData(data)
            }
        }
        
        this.World.Events.emit("entityCreated", entity)

        return entity
    }


}