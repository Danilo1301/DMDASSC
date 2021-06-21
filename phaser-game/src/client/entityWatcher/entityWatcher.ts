import { Component, WorldEntity } from "@phaserGame/utils";
import { World } from "@phaserGame/world";

class EntityWatchInfo {

    public Entity: WorldEntity

    public ComponentsData: {[key: string]: any} = {}
    public NewComponentsData: {[key: string]: any} = {}
    
    public GetData(component: Component, key: string) {
        var name = component.constructor.name
        if(!this.ComponentsData[name]) return

        return this.ComponentsData[name][key]
    }

    public GetNewData(component: Component, key: string) {
        var name = component.constructor.name
        if(!this.NewComponentsData[name]) return

        return this.NewComponentsData[name][key]
    }

    public SetData(component: Component, key: string, value: any) {
        var name = component.constructor.name
        if(!this.ComponentsData[name]) this.ComponentsData[name] = {}

        this.ComponentsData[name][key] = value
    }

    public SetNewData(component: Component, key: string, value: any) {
        var name = component.constructor.name
        if(!this.NewComponentsData[name]) this.NewComponentsData[name] = {}

        this.NewComponentsData[name][key] = value
    }

    public FormatEntityComponentsData(newDataOnly: boolean = false) {
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
        
        if(newDataOnly) {
            for (const componentName in info.NewComponentsData) {
                entityData.hasNewValues = true
                entityData.data.Components[componentName] = info.NewComponentsData[componentName]
            }
        } else {
            for (const componentName in info.ComponentsData) {
                entityData.data.Components[componentName] = info.ComponentsData[componentName]
            }
        }
        
        
        return entityData
    }

    constructor(entity: WorldEntity) {
        this.Entity = entity
    }
}

export class EntityWatcher {
    private _entities = new Phaser.Structs.Map<string, EntityWatchInfo>([])
 
    public get EntitiesInfo() { return this._entities.values() }

    public AddEntity(entity: WorldEntity): EntityWatchInfo {
        console.log(`[EntityWatcher] Added ${entity.Id}`)

        var info = new EntityWatchInfo(entity)

        this._entities.set(entity.Id, info)

        this.UpdateSingleEntityInfo(info)


        return info
    }

    public RemoveEntity(entity: WorldEntity): void {
        console.log(`[EntityWatcher] Removed ${entity.Id}`)
    }

    public HasEntity(entity: WorldEntity): boolean {
        return this._entities.has(entity.Id)
    }


    private UpdateSingleEntityInfo(info: EntityWatchInfo) {
        var entity = info.Entity
            
        for (const component of entity.Components) {
            var data = component.ToData()

            if(data) {
                for (const key in component.WatchingValues) {
                    var options = component.WatchingValues[key]
                    var value = data[key]
                    var oldValue = info.GetData(component, key)

        
                    if(typeof oldValue == 'number') {
    
                        if(options.minDifference) {
                            var difference = Math.abs(Math.abs(oldValue || 0) - Math.abs(value || 0))

                            if(difference > options.minDifference) {
            
                                info.SetData(component, key, value)
                                info.SetNewData(component, key, value)
                            }
                        }
                    } else {
                        if(oldValue != value) {
                            info.SetData(component, key, value)
                            info.SetNewData(component, key, value)
                        }

                        
                    }
                }
            }
        }
    }


    public Update(): void {
        //console.log(`[EntityWatcher] Verifying ${this._entities.size} entities...`)

        for (const info of this._entities.values()) {
            this.UpdateSingleEntityInfo(info)
        }
    }

    /*
    public _entities: WorldEntity[] = []

    private _lastComponentValues: {[key: string]: {[key: string]: {[key: string]: object}}} = {}
    public _newValues: {[key: string]: {[key: string]: {[key: string]: object}}} = {}

    public AddNewValue(entityId, componentName, key) {
        if(!this._newValues[entityId]) this._newValues[entityId] = {}
        if(!this._newValues[entityId][componentName]) this._newValues[entityId][componentName] = {}

        this._newValues[entityId][componentName][key] = this._lastComponentValues[entityId][componentName][key]

        //console.log(this._newValues)


    }

    public Update() {
        var entities = this._entities
        

        //console.log("-")

        for (const entity of entities) {

            if(!this._entities.includes(entity)) {
                this._entities.push(entity)

                console.log("new")
            }

            for (const component of entity.Components) {
                var componentName = component.constructor.name
                var data = component.ToData()

                var entityId = entity.Id

                if(data) {
                    if(!this._lastComponentValues[entityId]) this._lastComponentValues[entityId] = {}
                    if(!this._lastComponentValues[entityId][componentName]) this._lastComponentValues[entityId][componentName] = {}

                    for (const key in component.WatchingValues) {
                        var options = component.WatchingValues[key]
                        
                        var values = this._lastComponentValues[entityId][componentName]

                        var oldValue: any = values[key]
                        var newValue = data[key]

                        var self = this
                        const updateValue = function() {
                            //console.log(`[${componentName}] [${key}]`, options, `(${oldValue}) -> (${newValue})`)
                            values[key] = newValue

                            self.AddNewValue(entityId, componentName, key)
                        }
    
                        if(typeof data[key] == 'number') {
                            var old_n = oldValue as number
                            var new_n = newValue as number
    
                            if(options.minDifference) {
                                var difference = Math.abs(Math.abs(new_n || 0) - Math.abs(old_n || 0))
    
                                if(difference > options.minDifference) {
                                    updateValue()
                                }
                            }
                        } else {
                            updateValue()
                        }
                    }
                }
            }
        }
    }
    */
}