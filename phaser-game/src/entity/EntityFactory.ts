import Server from "@phaserGame/server/Server"
import Entity from "@phaserGame/entity/Entity"
import World from "@phaserGame/world/World"
import EntityPlayer from "./EntityPlayer"
import PositionComponent from "./component/PositionComponent"
import Component from "./component/Component"

import { v4 as uuidv4 } from 'uuid';


export default class EntityFactory
{
    private _server: Server

    private _entities = new Phaser.Structs.Map<string, Entity>([])

    private _registeredEntities = new Phaser.Structs.Map<string, {new(...args: any[]): Entity }>([])

    private _registeredComponents = new Phaser.Structs.Map<string, {new(...args: any[]): Component }>([])

    constructor(server: Server)
    {
        this._server = server
    }

    public hasEntity(id: string)
    {
        return this._entities.has(id)
    }

    public getEntity(id: string)
    {
        return this._entities.get(id)
    }

    public createEntity(entityType: string, world: World, options: any): Entity
    {
        //var entity = new EntityPlayer(world)

        var constr = this.getEntityByName(entityType)

        if(!constr) throw new Error("Invalid Entity Type '" + entityType + "'");
        
        var id = options.id == undefined ? ("ENTITY-" + uuidv4()) : options.id

        var entity = new constr(world)
        entity.setId(id)

        this._entities.set(entity.id, entity)

        entity.initialize()
        
        return entity
    }

    public registerEntity(name: string, constr: { new(...args: any[]): Entity }): void
    {
        this._registeredEntities.set(name, constr)
    }

    public registerComponent(name: string, constr: { new(...args: any[]): Component }): void
    {
        this._registeredComponents.set(name, constr)
    }

    public getComponentByName(componentName: string) { return this._registeredComponents.get(componentName) }

    public getEntityByName(entityName: string) { return this._registeredEntities.get(entityName) }
}