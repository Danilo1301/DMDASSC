import Component from "@phaserGame/entity/component/Component"
import PositionComponent from "@phaserGame/entity/component/PositionComponent"
import Entity from "@phaserGame/entity/Entity"

class EntityWatchInfo
{
    public entity: Entity

    private _data: {[key: string]: {[key: string]: any}} = {}

    constructor(entity: Entity)
    {
        this.entity = entity
    }

    public clearData(name)
    {
        this._data[name] = {}
    }

    public getData(name, component: Component, key: string)
    {
        if(!this._data[name]) this._data[name] = {} 

        var componentName = component.constructor.name

        if(!this._data[name][componentName]) this._data[name][componentName] = {} 

        return this._data[name][componentName][key]
    
    }

    public setData(name, component: Component, key: string, value: any)
    {
        this.getData(name, component, key)

        var componentName = component.constructor.name

        this._data[name][componentName][key] = value
    }

    public formatEntityComponentsData(newDataOnly: boolean = false)
    {
        var info = this
        var entity = info.entity

        var entityData = {
            hasNewValues: false,
            data: {
                id: entity.id,
                type: entity.constructor.name,
                components: {}
            }
        }

        if(newDataOnly)
        {
            for (const componentName in this._data['new'])
            {
                entityData.hasNewValues = true
                entityData.data.components[componentName] = this._data['new'][componentName]
            }
        }
        else
        {
            for (const componentName in this._data['current'])
            {
                entityData.data.components[componentName] = this._data['current'][componentName]
            }
        }

        return entityData
    }

    public updateInfo()
    {
        var entity = this.entity

        for (const component of entity.getComponents())
        {
            var data = component.toData()

            if(data)
            {
                for (const key in component.watchingValues)
                {
                    var options = component.watchingValues[key]
                    var value = data[key]
                    var oldValue = this.getData('current', component, key)

                    if(typeof oldValue == 'number')
                    {
                        if(options.minDifference)
                        {
                            var difference = Math.abs(Math.abs(oldValue || 0) - Math.abs(value || 0))

                            if(difference > options.minDifference)
                            {
                                this.setData('current', component, key, value)
                                this.setData('new', component, key, value)
                            }
                        }
                    }
                    else
                    {
                        if(oldValue != value)
                        {
                            this.setData('current', component, key, value)
                            this.setData('new', component, key, value)
                        }
                    }
                }
            }
        }

        //console.log(this._data)

        //this.setData("current", entity.getComponent(PositionComponent), "x", 155)

    
    }
}

export default class EntityWatcher
{
    private _entities = new Phaser.Structs.Map<string, EntityWatchInfo>([])

    public addEntity(entity: Entity): EntityWatchInfo
    {
        console.log(`[EntityWatcher] Added ${entity.id}`)

        var info = new EntityWatchInfo(entity)

        this._entities.set(entity.id, info)

        //this.UpdateSingleEntityInfo(info)

        return info
    }

    public removeEntity(entity: Entity): void
    {
        console.log(`[EntityWatcher] Removed ${entity.id}`)

        this._entities.delete(entity.id)
    }

    public hasEntity(entity: Entity): boolean { return this._entities.has(entity.id) }

    public update()
    {
        for (const entity of this._entities.values())
        {
            entity.updateInfo()
        }
    }

    public getEntitiesInfo()
    {
        return this._entities.values()
    }
}