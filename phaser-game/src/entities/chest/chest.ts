
import { WorldEntity } from "@phaserGame/utils/worldEntity";
import { ChestBehaviorComponent, InventoryComponent, PhysicBodyComponent, PositionComponent, SpriteComponent } from "@phaserGame/components";

export class EntityChest extends WorldEntity {
    constructor() {
        super()

        this.AddComponent(new PositionComponent())
        this.AddComponent(new PhysicBodyComponent())
        this.AddComponent(new SpriteComponent())
        this.AddComponent(new InventoryComponent())
        this.AddComponent(new ChestBehaviorComponent())

        var physicBodyComponent = this.GetComponent(PhysicBodyComponent)
        physicBodyComponent.Options = {
            isSensor: true
        }
        var body_part = physicBodyComponent.AddRectangle('body', 0, 0, 32, 32)
        
        
        var spriteComponent = this.GetComponent(SpriteComponent)
        var sprite_body = spriteComponent.Add('chest1', 'body', 0, 0)
        sprite_body.AttachedToBodyKey = 'body'
    }

    public Awake() {
        super.Awake()
    }

    public Start() {
        super.Start()
    }
}