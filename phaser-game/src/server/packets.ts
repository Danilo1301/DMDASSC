import { InputHandler, InputInfo, Position } from "@phaserGame/game/components"
import { Entity } from "@phaserGame/utils"

export class Packet {
    public Key: string
    public Data: PacketData

    constructor(key: string, data: PacketData) {
        this.Key = key
        this.Data = data
    }
}

export abstract class PacketData {}

export class PacketEntityInfo {
    public Id: string
    public EntityType: string
    public Position = {
        X: 0,
        Y: 0
    }
    public Velocity = {
        X: 0,
        Y: 0
    }
    public Inputs: InputInfo[] = []

    constructor(entity: Entity) {
        this.Id = entity.Id

        this.EntityType = entity.constructor.name

        var position = entity.GetComponent(Position)
        this.Position.X = position.X
        this.Position.Y = position.Y

        if(entity.HasComponent(InputHandler)) {
            this.Inputs = entity.GetComponent(InputHandler).GetInputs()
        }
    }
}

export class PacketEntities extends PacketData {
    public Entities: PacketEntityInfo[] = []
}

export class PacketId extends PacketData {
    public Id: string

    constructor(id: string) {
        super()
        this.Id = id
    }
}
