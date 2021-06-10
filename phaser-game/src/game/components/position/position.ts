import { Entity, IComponent } from "@phaserGame/utils"
import { PhysicBody } from "@phaserGame/game/components"

export class Position implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    private _x: number = 0
    private _y: number = 0

    public  get X(): number {
        return this._x
    }

    public get Y(): number {
        return this._y
    }

    public Set(x: number, y: number)
    {
        this._x = x
        this._y = y

        if(this.Entity.HasComponent(PhysicBody))
        {
            var physicBody = this.Entity.GetComponent(PhysicBody)
            
            physicBody.Matter.body.setPosition(physicBody.Body!, {x: x, y: y})
        }
    }

    public Awake(): void {
    }

    public Update(deltaTime: number): void {
        if(this.Entity.HasComponent(PhysicBody))
        {
            var body = this.Entity.GetComponent(PhysicBody).Body!;

            this._x = body.position.x
            this._y = body.position.y
        }
    }

    public Destroy(): void {
        
    }
}
