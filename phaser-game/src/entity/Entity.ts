import World from "@phaserGame/world/World";
import Component from "./component/Component";

export default class Entity
{
    private _world: World

    private _components: Component[] = []

    private _started: boolean = false

    private _id: string = ""

    constructor(world: World)
    {
        this._world = world
    }

    public initialize() {}

    public get id()
    {
        return this._id
    }

    public setId(id: string)
    {
        this._id = id
    }

    public getWorld()
    {
        return this._world
    }

    public step(delta: number)
    {
        for (const component of this.getComponents())
        {
            component.step(delta)
        }
    }

    public update(delta: number)
    {
        for (const component of this.getComponents())
        {
            component.update(delta)
        }
    }

    public start()
    {
        this._started = true

        for (const component of this.getComponents())
        {
            //component.create()
            if(!component.hasStarted()) component.start()
        }
    }

    public destroy()
    {
        for (const component of this.getComponents())
        {
            component.destroy()
        }
    }

    public getComponents(): Component[] { return this._components }
    
    public addComponent(component: Component): void {
        this._components.push(component)

        component.setEntity(this)
        component.create()
        
        if(this.hasStarted()) component.start()
    }
    
    public hasStarted()
    {
        return this._started
    }

    public getComponent<C extends Component>(constr: { new(...args: any[]): C }): C {
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

        if (toRemove != undefined && index != undefined) {
            this._components.splice(index, 1)

            toRemove.destroy()
        }
    }

    public hasComponent<C extends Component>(constr: { new(...args: any[]): C }): boolean {
        for (const component of this._components) {
            if (component instanceof constr) {
                return true
            }
        }
        return false
    }
}