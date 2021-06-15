import { World } from '@phaserGame/world'
import { Component } from './component.h'

export abstract class Entity {
    private _components: Component[] = []

    public get Components(): Component[] { return this._components }

    public AddComponent(component: Component): void {
        this._components.push(component)
        component.Entity = this
    }

    public GetComponent<C extends Component>(constr: { new(...args: any[]): C }): C {
        for (const component of this._components) {
            if (component instanceof constr) {
                return component as C
            }
        }

        throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`)
    }

    public RemoveComponent<C extends Component>(constr: { new(...args: any[]): C }): void {
        let toRemove: Component | undefined
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

    public HasComponent<C extends Component>(constr: { new(...args: any[]): C }): boolean {
        for (const component of this._components) {
            if (component instanceof constr) {
                return true
            }
        }
        return false
    }

    public Awake(): void {
        console.log(`[Entity ${this.constructor.name}] Awake`)

        for(const component of this._components){
            component.Awake()
        }
    }
    
 
    public Update(delta: number): void {
        for(const component of this._components) {
            component.Update(delta)
        }
    }

    public Destroy(): void {
        console.log(`[Entity ${this.constructor.name}] Destroy`)
        
        for(const component of this._components) {
            component.Destroy()
        }
    }
}

export abstract class WorldEntity extends Entity {
    public World: World
    
    private _id: string = ""

    constructor(world: World) {
        super()

        this.World = world
    }

    public get Id(): string { return this._id }
    public set Id(value: string) { this._id = value }
}