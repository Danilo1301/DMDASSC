import { Component, WorldEntity } from "@phaserGame/utils";

class EntityWatchInfo
{
    public Entity: WorldEntity

    public ComponentsData: {[key: string]: any} = {}

    public NewComponentsData: {[key: string]: any} = {}

    constructor(entity: WorldEntity)
    {
        this.Entity = entity
    }
    
    public GetData(component: Component, key: string)
    {
        var name = component.constructor.name

        if(!this.ComponentsData[name]) return

        return this.ComponentsData[name][key]
    }

    public GetNewData(component: Component, key: string)
    {
        var name = component.constructor.name

        if(!this.NewComponentsData[name]) return

        return this.NewComponentsData[name][key]
    }

    public SetData(component: Component, key: string, value: any)
    {
        var name = component.constructor.name

        if(!this.ComponentsData[name]) this.ComponentsData[name] = {}

        this.ComponentsData[name][key] = value
    }

    public SetNewData(component: Component, key: string, value: any)
    {
        var name = component.constructor.name

        if(!this.NewComponentsData[name]) this.NewComponentsData[name] = {}

        this.NewComponentsData[name][key] = value
    }

    public FormatEntityComponentsData(newDataOnly: boolean = false)
    {
        var info = this
        var entity = info.Entity

        var entityData = {
            hasNewValues: false,
            data: {
                Id: entity.Id,
                Type: entity.constructor.name,
                Components: {}
            }
        }
        
        if(newDataOnly)
        {
            for (const componentName in info.NewComponentsData)
            {
                entityData.hasNewValues = true
                entityData.data.Components[componentName] = info.NewComponentsData[componentName]
            }
        }
        else
        {
            for (const componentName in info.ComponentsData)
            {
                entityData.data.Components[componentName] = info.ComponentsData[componentName]
            }
        }
        
        return entityData
    }
}

export class EntityWatcher
{
    private _entities = new Phaser.Structs.Map<string, EntityWatchInfo>([])
 
    public get EntitiesInfo() { return this._entities.values() }

    public AddEntity(entity: WorldEntity): EntityWatchInfo
    {
        console.log(`[EntityWatcher] Added ${entity.Id}`)

        var info = new EntityWatchInfo(entity)

        this._entities.set(entity.Id, info)

        this.UpdateSingleEntityInfo(info)

        return info
    }

    public RemoveEntity(entity: WorldEntity): void
    {
        console.log(`[EntityWatcher] Removed ${entity.Id}`)

        this._entities.delete(entity.Id)
    }

    public HasEntity(entity: WorldEntity): boolean { return this._entities.has(entity.Id) }

    private UpdateSingleEntityInfo(info: EntityWatchInfo)
    {
        var entity = info.Entity
            
        for (const component of entity.Components)
        {
            var data = component.ToData()

            if(data)
            {
                for (const key in component.WatchingValues)
                {
                    var options = component.WatchingValues[key]
                    var value = data[key]
                    var oldValue = info.GetData(component, key)

                    if(typeof oldValue == 'number')
                    {
                        if(options.minDifference)
                        {
                            var difference = Math.abs(Math.abs(oldValue || 0) - Math.abs(value || 0))

                            if(difference > options.minDifference)
                            {
                                info.SetData(component, key, value)
                                info.SetNewData(component, key, value)
                            }
                        }
                    }
                    else
                    {
                        if(oldValue != value)
                        {
                            info.SetData(component, key, value)
                            info.SetNewData(component, key, value)
                        }
                    }
                }
            }
        }
    }


    public Update(): void
    {
        //console.log(`[EntityWatcher] Verifying ${this._entities.size} entities...`)

        for (const info of this._entities.values())
        {
            this.UpdateSingleEntityInfo(info)
        }
    }
}