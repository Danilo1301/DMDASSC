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

export interface PacketDataEntity {
    Id: string
    Type: string
    Components: object
}