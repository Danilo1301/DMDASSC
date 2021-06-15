import { Component } from "@phaserGame/utils";
import { Position } from "../position";

class SyncComponent {
    constructor(componentName: string) {

    }
}

export class NetworkEntity extends Component {
    public SyncEnabled: boolean = false

    constructor() {
        super()
    }

    public Awake(): void {
        
    }
    
    public Update(delta: number): void {
        
    }

    public Destroy(): void {
 
    }

    public GetComponentsData() {
        var componentsData: { [key: string]: any; } = {}

        for (const component of this.Entity!.Components) {
            var name = component.constructor.name
            var data = component.ToData()

            if(data) componentsData[name] = data
        }
        
        return componentsData
    }

    public SetComponentsData(componentsData: { [key: string]: any; }) {
        var entity = this.Entity!

        for (const componentName in componentsData) {
            for (const component of entity.Components) {
                if(componentName == component.constructor.name) {
                    component.FromData(componentsData[componentName])
                }
            }
        }
    }

    
}