import { EntityPlayer } from "@phaserGame/entities"
import { EntityBlock } from "@phaserGame/entities/block"
import { InputHandlerComponent, PhysicBodyComponent, PositionComponent } from "@phaserGame/components"
import { EntityProjectile } from "@phaserGame/entities/projectile"
import { EntityManager } from "@phaserGame/entityManager/entityManager"
import { Component, WorldEntity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"
import { Network } from "@phaserGame/network"
import { PacketDataEntity } from "@phaserGame/packets"

interface ICreateEntityOptions {
    id?: string
    autoActivate?: boolean
}

export class EntityFactory {
    public EntityManager: EntityManager
    public World!: World

    private _entities = new Phaser.Structs.Map<string, WorldEntity>([])

    constructor(entityManager: EntityManager, world: World) {
        this.EntityManager = entityManager
        this.World = world
        
        Network.Events.on('received_packet:entity_stream_in', (data: PacketDataEntity) => {
            console.log('entity_stream_in')

            if(!this.HasEntity(data.Id)) {
                var entity = this.CreateEntity(data.Type, {autoActivate: true, id: data.Id})
                entity.IsNetworkEntity = true


                if(entity.Id == Network.EntityId) {
                    Network.Entity = entity


                    var camera =  this.World.Scene.cameras.main
                    camera.startFollow(entity.GetComponent(PhysicBodyComponent).DefaultBody!.position, false, 0.1, 0.1)
                    

                    camera.setZoom(1.5)

                    entity.IsNetworkEntity = false
                    entity.GetComponent(InputHandlerComponent).ControlledByPlayer = true
                }
            }

        })

        Network.Events.on('received_packet:entity_data', (data: PacketDataEntity) => {
            if(data.Id == Network.EntityId) return
       
            if(this.HasEntity(data.Id)) {
                var entity = this.GetEntity(data.Id)

                for (const component of entity.Components) {
                    var componentdata = data.Components[component.constructor.name]

                    if(componentdata) component.FromData(componentdata)
                }
            }

            

       
        })
    }

    public get Entities(): WorldEntity[] { return this._entities.values() }

    public HasEntity(key: string) {
        return this._entities.has(key)
    }

    public GetEntity(key: string) {
        return this._entities.get(key)
    }

    public CreateEntity(type: string, options: ICreateEntityOptions) : WorldEntity {
        var constr = EntityFactory.GetEntityByName(type)

        if(!constr) throw new Error("Invalid Entity Type '" + type + "'");
        
        var entity = new constr()
        entity.Id = options.id == undefined ? 'ENTITY_' + Math.random() : options.id
        entity.World = this.World

        console.log(`[EntityFactory] Create entity '${type}', ID: ${entity.Id}`)

        this.EntityManager.AddEntity(entity)

        this._entities.set(entity.Id, entity)

        if(options?.autoActivate) {
            this.EntityManager.ActivateEntity(entity)
        }

        return entity
    }

    public RemoveEntity(entity: WorldEntity) {
        if(this._entities.has(entity.Id)) this._entities.delete(entity.Id)
    
        this.EntityManager.RemoveEntity(entity)

        entity.Destroy()
    }

    //--

    private static _registeredEntities = new Phaser.Structs.Map<string, {new(...args: any[]): WorldEntity }>([])
    private static _registeredComponents = new Phaser.Structs.Map<string, {new(...args: any[]): Component }>([])

    public static Setup() {
        this.RegisterEntity('EntityPlayer', EntityPlayer)
        this.RegisterEntity('EntityProjectile', EntityProjectile)
        this.RegisterEntity('EntityBlock', EntityBlock)

        this.RegisterComponent('PositionComponent', PositionComponent)
    }

    public static GetComponentByName(componentName: string) { return this._registeredComponents.get(componentName) }

    public static GetEntityByName(entityName: string) { return this._registeredEntities.get(entityName) }

    private static RegisterEntity(name: string, constr: { new(...args: any[]): WorldEntity }): void { this._registeredEntities.set(name, constr) }

    private static RegisterComponent(name: string, constr: { new(...args: any[]): Component }): void { this._registeredComponents.set(name, constr) }



    
}