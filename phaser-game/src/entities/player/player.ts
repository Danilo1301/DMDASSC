import { WorldEntity } from "@phaserGame/utils/worldEntity";
import { MovementComponent, PhysicBodyComponent, PositionComponent, SpriteComponent } from "@phaserGame/components";
import { InputHandlerComponent } from "@phaserGame/components/inputHandler";

export class EntityPlayer extends WorldEntity {
    constructor() {
        super()

        this.AddComponent(new PositionComponent())
        
        this.AddComponent(new PhysicBodyComponent())
        this.AddComponent(new SpriteComponent())

        this.AddComponent(new MovementComponent())
        this.AddComponent(new InputHandlerComponent())

        var physicBodyComponent = this.GetComponent(PhysicBodyComponent)
        physicBodyComponent.Options = {
            frictionAir: 0.2,
            mass: 100
        }
        physicBodyComponent.AddCircle('body', 0, 0, 16)
        
        var spriteComponent = this.GetComponent(SpriteComponent)
        var sprite_body = spriteComponent.Add('player1', 'body', 0, 0)
        sprite_body.AttachedToBodyKey = 'body'
    }

    public Awake() {
        super.Awake()
    }

    public Start() {
        super.Start()
    }

    public Step(delta: number) {
        super.Step(delta)
    }

    public Update(delta: number) {
        super.Update(delta)
        
    }
}