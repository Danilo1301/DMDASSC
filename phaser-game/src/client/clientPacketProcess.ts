import { PositionComponent } from "@phaserGame/components";
import { PacketDataComponentFunction } from "@phaserGame/packets";
import { Client } from ".";

export default class ClientPacketProcess
{
    private _client: Client

    constructor(client: Client)
    {
        this._client = client
    }

    public OnJoinServer(data: any)
    {
        var server = this._client.Game.Servers[0]

        server.HandleClientConnection(this._client)
    }

    public OnClientData(data: any)
    {
        var x = data['x']
        var y = data['y']

        var entity = this._client.Entity

        if(entity)
        {
            var position = entity.GetComponent(PositionComponent)

            position.Set(x, y)
        }
    }

    public OnCallComponentFunction(packetData: PacketDataComponentFunction)
    {
        console.log("packetData", packetData)

        const cfData = packetData.Data

        console.log('call_component_function', cfData)

        var world = this._client.GetCurrentServerWorld()!

        var entity = world.EntityFactory.GetEntity(cfData.EntityId)

        cfData.Data.id = this._client.Id

        for (const component of entity.Components)
        {
            if(component.constructor.name == cfData.ComponentName)
            {
                component.OnReceiveFunction(cfData.Key, cfData.Data)
            }
        }
    }
}