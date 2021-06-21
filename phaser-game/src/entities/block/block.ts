import { WorldEntity } from "@phaserGame/utils/worldEntity";
import { PhysicBodyComponent, PositionComponent, SpriteComponent } from "../../components";

export class EntityBlock extends WorldEntity {
    constructor() {
        super()

        this.AddComponent(new PositionComponent())
        
        this.AddComponent(new PhysicBodyComponent())
        this.AddComponent(new SpriteComponent())

        var physicBodyComponent = this.GetComponent(PhysicBodyComponent)
        physicBodyComponent.Options = {
            isSensor: true
        }
        var body_part = physicBodyComponent.AddRectangle('body', 0, 0, 64, 64)
        
        
        var spriteComponent = this.GetComponent(SpriteComponent)
        var sprite_body = spriteComponent.Add('block64', 'body', 0, 0)
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

    public Movement(delta: number) {
        
    }
}