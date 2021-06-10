import { Entity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"
import { PhysicBody, Position } from "@phaserGame/game/components"

export class EntityCrate extends Entity {
    constructor(world: World, id: string) {
        super(world, id)

        this.AddComponent(new Position())
        this.AddComponent(new PhysicBody())

    }

    public get Position(): Position { return this.GetComponent(Position) }
    public get PhysicBody(): PhysicBody { return this.GetComponent(PhysicBody) }


    public Awake() {
        super.Awake()

        this.PhysicBody.SpriteName = "block1"
        this.PhysicBody.AddCollisionCircle('body', 0, 0, 20)
        this.Position.Set(400, 300)
    }

    public Update(deltaTime: number) {
        super.Update(deltaTime)
    }
}