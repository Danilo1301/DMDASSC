import { IDestroy, IStart, IUpdate } from "@game/utils/Interfaces";
import { Component } from "./Component";

export class BaseEntity implements IStart, IUpdate, IDestroy {
    private _components: Component[] = [];

    private _started: boolean = false;

    public get components() { return this._components; }

    public start() {
        for (const component of this.components) component.start();  
        this._started = true;
    }

    public update(delta: number) {
        for (const component of this.components) component.update(delta);
    }

    public destroy() {
        for (const component of this.components) component.destroy();
    }

    public addComponent(component: Component) {
        this._components.push(component);
        component.entity = this;
        this.updateComponentsOrder();
        if(this._started) component.start();
    }

    public getComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) {
            if (component instanceof constr) {
                return component as C;
            }
        }

        throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`)
    }

    public removeComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        let toRemove: Component | undefined;
        let index: number | undefined;
      
        for (let i = 0; i < this._components.length; i++) {
            const component = this._components[i]
            if (component instanceof constr) {
                toRemove = component;
                index = i;
                break
            }
        }

        if (toRemove != undefined && index != undefined) {
            this._components.splice(index, 1)

            toRemove.destroy()
        }
    }

    public hasComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) {
            if (component instanceof constr) {
                return true;
            }
        }
        return false;
    }

    private updateComponentsOrder() {
        this._components = this._components.sort((a, b) => a.priority - b.priority)
    }
}