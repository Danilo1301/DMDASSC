
import { WorldEntity } from "@phaserGame/utils/worldEntity";
import { PositionComponent } from "@phaserGame/components";

export class EntityProjectile extends WorldEntity {
    constructor() {
        super()

        this.AddComponent(new PositionComponent())
    }

    public Awake() {
        super.Awake()
    }

    public Start() {
        super.Start()
    }
}