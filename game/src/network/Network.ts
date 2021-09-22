import { PhysicBody } from "@game/components/PhysicBody";
import { Position } from "@game/components/Position";
import { GameClient } from "@game/game/GameClient";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { PacketSender } from "@game/utils/PacketSender";
import { io, Socket } from "socket.io-client";
import LocalPlayer from "./LocalPlayer";

export default class Network
{
    public events = new Phaser.Events.EventEmitter();

    private _game: GameClient

    private _packetSender: PacketSender

    constructor(game: GameClient)
    {
        this._game = game

        var address = `${location.protocol}//${location.host}/api/game`

        var socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        })

        this._packetSender = new PacketSender(socket)

        this._packetSender.events.on("RECEIVED_PACKET", packet => {
            this.events.emit("RECEIVED_PACKET:" + packet.key, packet.data)
        })

        socket.on("connect", () => {
            this.events.emit("connect");

            console.log(`[Network] Connected`);
        })


        this.events.on("RECEIVED_PACKET:ENTITY_STREAM_IN", (entityData) =>
        {
            
            var server = this._game.servers[0]
            var world = server.worlds[0]

            var entity = world.createEntity(entityData.type, {id: entityData.id})

            //
            for (const component of entity.components)
            {
                var componentdata = entityData.components[component.constructor.name]

                if(componentdata) component.fromData(componentdata)
            }
            //

            world.addEntity(entity)

            if(entity.id == LocalPlayer.entityId)
            {
                LocalPlayer.setEntity(entity)

                
            }
            
        })

        this.events.on("RECEIVED_PACKET:ENTITY_DATA", (entityData) =>
        {
            
            var server = this._game.servers[0]

            if(entityData.id == LocalPlayer.entityId)
            {
                return
            }

            const world = server.worlds[0]
   
           

            if(world.hasEntity(entityData.id))
            {
                var entity = world.getEntity(entityData.id)

                for (const component of entity.components)
                {
                    var componentdata = entityData.components[component.constructor.name]

                    if(componentdata) component.fromData(componentdata)
                }
            }
            
        })


        


    }

    public initialize()
    {
        console.log(`[Network] Initialize`)

        setInterval(() => {
            this.update(16);
        }, 16)
    }

    public update(delta: number)
    {
        var playerEntity = LocalPlayer.entity;

        //console.log(playerEntity, LocalPlayer.isMultiplayer)

        if(playerEntity)
        {
            if(LocalPlayer.isMultiplayer)
            {
                var position = playerEntity.getComponent(Position)
                //var velocity = playerEntity.getComponent(PhysicBody).getVelocity()

                this.send("CLIENT_DATA", {
                    position: {x: position.x, y: position.y},
                    //velocity: {x: velocity.x, y: velocity.y}
                })
            }
            
            
        }
    }

    public send(key: string, data: any)
    {
        this._packetSender.send(key, data)
    }

    public getSocket()
    {
        return this._packetSender.getSocket()
    }

    public connect()
    {
        this.getSocket().connect()

        console.log(`[Network] Connect`);
    }
}