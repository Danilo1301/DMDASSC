import { World } from '@phaserGame/world'
import { WorldScene } from '@phaserGame/world/worldScene'
import { IAwake, IUpdate } from '../lifecycle'
import { IComponent } from './component.h'

import { v4 as uuidv4 } from 'uuid';

export abstract class Entity implements IAwake, IUpdate {
    public Scene: WorldScene
    public World: World

    public HasAwaken: boolean = false

    private _components: IComponent[] = []
    private _id: string

    constructor(world: World, id: string | null) {
        this.World = world
        this.Scene = world.Scene

        this._id = id === null ? uuidv4() : id
    }

    public get Id(): string { return this._id }

    public get Components(): IComponent[] { return this._components }

    public AddComponent(component: IComponent): void {
        this._components.push(component)
        component.Entity = this

        if(this.HasAwaken) component.Awake()
    }

    public GetComponent<C extends IComponent>(constr: { new(...args: any[]): C }): C {
        for (const component of this._components) {
            if (component instanceof constr) {
                return component as C
            }
        }

        throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`)
    }

    public RemoveComponent<C extends IComponent>(constr: { new(...args: any[]): C }): void {
        let toRemove: IComponent | undefined
        let index: number | undefined
      
        for (let i = 0; i < this._components.length; i++) {
            const component = this._components[i]
            if (component instanceof constr) {
                toRemove = component
                index = i
                break
            }
        }
      
        if (toRemove && index) {
            toRemove.Entity = undefined
            this._components.splice(index, 1)
        }
    }

    public HasComponent<C extends IComponent>(constr: { new(...args: any[]): C }): boolean {
        for (const component of this._components) {
            if (component instanceof constr) {
                return true
            }
        }
        return false
    }

    public Awake(): void {
        if(this.HasAwaken) return

        console.log(`Entity.${this.constructor.name}.Awake()`)

        this.HasAwaken = true

        for(const component of this._components){
            component.Awake()
        }
    }
    
 
    public Update(deltaTime: number): void {
        for(const component of this._components) {
            component.Update(deltaTime)
        }
    }
}