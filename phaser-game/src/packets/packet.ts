import { Position } from "@phaserGame/components"
import { NetworkEntity } from "@phaserGame/components/networkEntity"
import { WorldEntity } from "@phaserGame/utils"

export class Packet {
    public Key: string
    public Data: PacketData

    constructor(key: string, data: PacketData) {
        this.Key = key
        this.Data = data
    }
}

export interface PacketData {}

export class PacketDataEntity implements PacketData {
    public Id: string
    public Type: string
    public ComponentsData: { [key: string]: any; } = {}

    constructor(entity: WorldEntity) {
        this.Id = entity.Id
        this.Type = entity.constructor.name
        
        var networkEntity = entity.GetComponent(NetworkEntity)
        if(networkEntity) {
            this.ComponentsData = networkEntity.GetComponentsData()
        }
    }
}