import { InputHandler, PhysicBody, Position, WorldText } from "@phaserGame/components"
import { NetworkEntity } from "@phaserGame/components/networkEntity"
import { WorldEntity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"

export class EntityPlayer extends WorldEntity {
    constructor(world: World) {
        super(world)

        this.AddComponent(new Position({x: 400, y: 300}))
        this.AddComponent(new PhysicBody({spriteName: "player1"}))
        this.AddComponent(new InputHandler())
        this.AddComponent(new WorldText())

        this.AddComponent(new NetworkEntity())

    }

    public Awake() {
        super.Awake()
    }

    public Update(deltaTime: number) {
        super.Update(deltaTime)
    }

    public Destroy() {
        super.Destroy()
    }
}