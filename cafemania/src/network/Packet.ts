
import { PlayerSerializedData } from "@cafemania/player/Player";
import { TileSerializedData } from "@cafemania/tile/Tile";

export interface IPacketWorldData
{
    tiles?: TileSerializedData[]
    waiters?: PlayerSerializedData[]
    sideWalkSize: number
}

export interface IPacketSpawnClientData
{
    client: PlayerSerializedData
}

export interface IPacketClientReachedDoorData
{
    clientId: string
}

export interface IPacketClientFindChairData
{
    clientId: string
    chairId?: string
}

export interface IPacketClientReachedChairData
{
    clientId: string
}

export interface IPacketWaiterServeClientData
{
    waiterId: string
    clientId: string
    counterId: string
}

export interface IPacketWaiterFinishServeData
{
    waiterId: string

}