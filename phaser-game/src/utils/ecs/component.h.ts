import { Entity } from "./entity";

export abstract class Component {
    public Entity?: Entity
    
    public Awake(): void {
    }
    
    public Update(delta: number): void {
    }

    public Destroy(): void {
    }

    public FromData(data: any) {
       
    }

    public ToData(): any {
       
    }
}