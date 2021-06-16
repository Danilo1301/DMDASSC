import { PhysicBody, Position } from "@phaserGame/components"
import { NetworkEntity } from "@phaserGame/components/networkEntity"
import { WorldEntity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"

export class EntityCrate extends WorldEntity {
    constructor(world: World) {
        super(world)

        this.AddComponent(new Position({x: 0, y: 0}))
        this.AddComponent(new PhysicBody({spriteName: "block" + (Math.round(Math.random()) + 1) }))
        this.AddComponent(new NetworkEntity())
    }

    public Awake() {
        super.Awake()
    }

    public Update(deltaTime: number) {
        super.Update(deltaTime)
    }
}