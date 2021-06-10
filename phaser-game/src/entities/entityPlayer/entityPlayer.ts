import { Entity } from "@phaserGame/utils"
import { World } from "@phaserGame/world"
import { InputHandler, PhysicBody, Position } from "@phaserGame/game/components"

export class EntityPlayer extends Entity {
    constructor(world: World, id: string) {
        super(world, id)

        this.AddComponent(new Position())
        this.AddComponent(new PhysicBody())
        this.AddComponent(new InputHandler())

    }

    public get Position(): Position { return this.GetComponent(Position) }
    public get PhysicBody(): PhysicBody { return this.GetComponent(PhysicBody) }
    public get InputHandler(): InputHandler { return this.GetComponent(InputHandler) }

    public Awake() {
        super.Awake()

        this.PhysicBody.SpriteName = "player1"
        this.PhysicBody.AddCollisionCircle('body', 0, 0, 16)
        this.Position.Set(400, 300)
    }

    public Update(deltaTime: number) {
        super.Update(deltaTime)

        var speed = 2
        this.PhysicBody.SetVelocity(this.InputHandler.GetHorizontal() * (speed/10) * deltaTime, this.InputHandler.GetVertical() * (speed/10) * deltaTime)
    }
}