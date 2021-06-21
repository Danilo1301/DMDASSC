import { World } from "@phaserGame/world"
import { Entity } from "../entity"

export class WorldEntity extends Entity {
    public World!: World
    public Id: string = ""
    public IsNetworkEntity: boolean = false
}