import { Position } from "@game/components/Position"
import { Component } from "@game/entity/Component"
import { Entity } from "@game/entity/Entity"

export interface IWatchComponentDataOptions {
    minDifference?: number
}


export class EntityWatchInfo
{
    public entity: Entity

    private _data: {[key: string]: {[key: string]: any}} = {}
    private _entityWatcher: EntityWatcher;

    constructor(entityWatcher: EntityWatcher, entity: Entity)
    {
        this._entityWatcher = entityWatcher
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
        const watchingComponents = this._entityWatcher.watchingComponents

        var entity = this.entity

        for (const component of entity.components)
        {
            var data = component.toData()

            

            if(data)
            {
                const keys = watchingComponents[component.constructor.name];

                //console.log(watchingComponents, component.constructor.name)

                for (const key in keys)
                {
                    var options = keys[key]
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

export class EntityWatcher
{
    private _entities = new Phaser.Structs.Map<string, EntityWatchInfo>([])

    private _watchingComponents: {[componentName: string]: {[key: string]: IWatchComponentDataOptions} } = {};

    constructor() {
        this.watchComponent('Position', 'x', {minDifference: 0.05});
        this.watchComponent('Position', 'y', {minDifference: 0.05});
    }

    public get watchingComponents() { return this._watchingComponents; }

    private watchComponent(name: string, key: string, options: IWatchComponentDataOptions) {
        if(!this._watchingComponents[name]) this._watchingComponents[name] = {};
        this._watchingComponents[name][key] = options;
    }

    public addEntity(entity: Entity): EntityWatchInfo
    {
        console.log(`[EntityWatcher] Added ${entity.id}`)

        var info = new EntityWatchInfo(this, entity)

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