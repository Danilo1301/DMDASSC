import { Game } from "@phaserGame/game"
import { Component } from "@phaserGame/utils/component"

export class Entity {
    public Game!: Game
    
    public HasAwaken: boolean = false
    public HasStarted: boolean = false

    private _components: Component[] = []

    public get Components(): Component[] { return this._components }
    
    public AddComponent(component: Component): void {
        this._components.push(component)
        component.Entity = this

        if(this.HasAwaken) component.Awake()
        if(this.HasStarted) component.Start()
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
            //toRemove.Entity = undefined
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
        this.HasAwaken = true

        for (const component of this._components) component.Awake()
    }

    public Start(): void {
        this.HasStarted = true

        for (const component of this._components) component.Start()
    }

    public Destroy(): void {
        this.HasAwaken = false
        this.HasStarted = false

        for (const component of this._components) component.Destroy()
    }

    public PreStep(delta: number): void {
        for (const component of this._components) component.PreStep(delta)
    }

    public Step(delta: number): void {
        for (const component of this._components) component.Step(delta)
    }

    public PostStep(delta: number): void {
        for (const component of this._components) component.PostStep(delta)
    }

    public PreUpdate(delta: number): void {
        for (const component of this._components) component.PreUpdate(delta)
    }

    public Update(delta: number): void {
        for (const component of this._components) component.Update(delta)
    }

    public PostUpdate(delta: number): void {
        for (const component of this._components) component.PostUpdate(delta)
    }
}






class Demo extends Entity {
    public Awake(): void {
        super.Awake()
    }

    public Start(): void {
        super.Start()
    }

    public Step(delta: number): void {
        super.Step(delta)
    }

    public PreUpdate(delta: number): void {
        super.PreUpdate(delta)
    }

    public Update(delta: number): void {
        super.Update(delta)
    }

    public PostUpdate(delta: number): void {
        super.PostUpdate(delta)
    }
}