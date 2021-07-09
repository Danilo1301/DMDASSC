import GameClient from "@phaserGame/game/GameClient";
import PacketSender from "./PacketSender";

import { io, Socket } from "socket.io-client";
import LocalPlayer from "@phaserGame/game/LocalPlayer";
import { InputHandlerComponent } from "@phaserGame/entity/component/InputHandlerComponent";
import PositionComponent from "@phaserGame/entity/component/PositionComponent";
import GameSceneManager from "@phaserGame/game/GameSceneManager";
import PhysicBodyComponent from "@phaserGame/entity/component/PhysicBodyComponent";

export default class Network
{
    public events = new Phaser.Events.EventEmitter();

    private _game: GameClient

    private _packetSender: PacketSender

    constructor(game: GameClient)
    {
        this._game = game

        var address = `${location.protocol}//${location.host}/api/phaserGame`

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
            this.events.emit("connect")
        })


        this.events.on("RECEIVED_PACKET:ENTITY_STREAM_IN", (entityData) =>
        {
            var server = this._game.getServers()[0]
            var world = server.getWorlds()[0]

            var entity = server.getEntityFactory().createEntity(entityData.type, world, {id: entityData.id})

            //
            for (const component of entity.getComponents())
            {
                var componentdata = entityData.components[component.constructor.name]

                if(componentdata) component.fromData(componentdata)
            }
            //

            world.addEntity(entity)

            if(entity.id == LocalPlayer.getEntityId())
            {
                LocalPlayer.setEntity(entity)

                
            }
        })

        this.events.on("RECEIVED_PACKET:ENTITY_DATA", (entityData) =>
        {
            var server = this._game.getServers()[0]
            var entityFactory = server.getEntityFactory()

            if(entityData.id == LocalPlayer.getEntityId())
            {
                return
            }

   
            if(entityFactory.hasEntity(entityData.id))
            {
                var entity = entityFactory.getEntity(entityData.id)

                for (const component of entity.getComponents())
                {
                    var componentdata = entityData.components[component.constructor.name]

                    if(componentdata) component.fromData(componentdata)
                }
            }
        })


        


    }

    public initialize()
    {
        var phaser = GameSceneManager.getGame()

        phaser.events.on("step", (time, delta) => {
            this.update(delta)
        })
    }

    public update(delta: number)
    {
        var playerEntity = LocalPlayer.getEntity()

        if(playerEntity)
        {
            if(playerEntity.getWorld().getServer().isMultiplayerServer)
            {
                var position = playerEntity.getComponent(PositionComponent)
                var velocity = playerEntity.getComponent(PhysicBodyComponent).getVelocity()

                this.send("CLIENT_DATA", {
                    position: {x: position.x, y: position.y},
                    velocity: {x: velocity.x, y: velocity.y}
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

        
    }
}