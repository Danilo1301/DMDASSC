import { EntityFactory } from "@phaserGame/entityFactory";
import { Component, WorldEntity } from "@phaserGame/utils";


export class NetworkEntity extends Component {
    public Entity: WorldEntity | undefined

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
            var toSetComponent: Component | undefined = undefined;

            for (const component of entity.Components) {
                if(componentName == component.constructor.name) {
                    //sconsole.log(`${componentName} == ${component.constructor.name}`)

                    toSetComponent = component
                    break;
                }
            }

            ///console.log(this.Entity!.constructor.name, componentName, toSetComponent != undefined)

           // console.log(toSetComponent)

            if(!toSetComponent) {
                var component_construct = EntityFactory.GetComponentByName(componentName)
                
                console.log(toSetComponent)
                
                toSetComponent = new component_construct()

                

                this.Entity!.AddComponent(toSetComponent)
            }

            toSetComponent.FromData(componentsData[componentName])
        }
    }

    
}