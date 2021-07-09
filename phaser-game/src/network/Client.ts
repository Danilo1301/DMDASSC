import PhysicBodyComponent from "@phaserGame/entity/component/PhysicBodyComponent";
import PositionComponent from "@phaserGame/entity/component/PositionComponent";
import Entity from "@phaserGame/entity/Entity";
import GameSceneManager from "@phaserGame/game/GameSceneManager";
import GameServer from "@phaserGame/game/GameServer"
import Server from "@phaserGame/server/Server";
import socketio from 'socket.io';
import EntityWatcher from "./EntityWatcher";
import PacketSender from "./PacketSender";

import { v4 as uuidv4 } from 'uuid';

export default class Client
{
    private _game: GameServer

    private _packetSender: PacketSender

    private _id: string = ""

    private _server?: Server
    private _entity?: Entity

    private _entityWatcher: EntityWatcher

    constructor(game: GameServer, socket: socketio.Socket)
    {
        this._id = "CLIENT-" + uuidv4()

        this._game = game

        this._packetSender = new PacketSender(socket)

        this._packetSender.events.on('RECEIVED_PACKET:GET_SERVERS_LIST', (packet) =>
        {
            var servers = this._game.getServers()
            var packetData: any = {servers: []}

            for (const server of servers) {
                packetData.servers.push({
                    id: server.id,
                    players: server.getClients().length
                })
            }

            this._packetSender.send("SERVERS_LIST", packetData)
        })

        this._packetSender.events.on('RECEIVED_PACKET:CONNECT_TO_SERVER', (packet) =>
        {
            var id = packet.id
            var server = this._game.getServer(id)

            server.handleClientConnection(this)

            this._server = server
        })

        this._packetSender.events.on('RECEIVED_PACKET:REQUEST_ACTION', (packet) =>
        {
            this._server!.events.emit('REQUEST_ACTION', packet.action, packet.data, this.id)
        })

        this._packetSender.events.on('RECEIVED_PACKET:CLIENT_DATA', (data) =>
        {
            if(this._entity)
            {
                var position = this._entity.getComponent(PositionComponent)

                position.set(data.position.x, data.position.y)

                var physicBody = this._entity.getComponent(PhysicBodyComponent)
                physicBody.setVelocity(data.velocity.x, data.velocity.y)
            }
        })

        
        socket.on("disconnect", () =>
        {
            if(this._server) this._server.handleClientDisconnect(this)
        })

        var phaser = GameSceneManager.getGame()

        phaser.events.on("step", (time, delta) => {
            this.update(delta)
        })


        this._entityWatcher = new EntityWatcher()
    }

    public setEntity(entity: Entity) {
        this._entity = entity
    }

    public getServer()
    {
        return this._server
    }

    public update(delta: number)
    {
        var server = this.getServer()

        if(!server) return

        var world = server.getWorlds()[0]

        if(!world) return

        for (const entity of world.getEntities())
        {
            var clientEntity = this._entity

            var clientPosition = {x: 0, y: 0}

            if(clientEntity)
            {
                var position = clientEntity.getComponent(PositionComponent)
                clientPosition.x = position.x
                clientPosition.y = position.y
            }

            var entityPosition = entity.getComponent(PositionComponent)

            var distance = Phaser.Math.Distance.BetweenPoints(clientPosition, {x: entityPosition.x, y: entityPosition.y})

            if(distance < 2000)
            {
                if(!this._entityWatcher.hasEntity(entity))
                {
                    var info = this._entityWatcher.addEntity(entity)

                    info.updateInfo()

                    var entitydata = info.formatEntityComponentsData(false)

                    this.send("ENTITY_STREAM_IN", entitydata.data)
                }
            }
            else {
                if(this._entityWatcher.hasEntity(entity))
                {
                    this._entityWatcher.removeEntity(entity)

                    this.send("ENTITY_STREAM_OUT", entity.id)
                }
            }
            
        }
        
        this._entityWatcher.update()

        for (const info of this._entityWatcher.getEntitiesInfo())
        {
            var entitydata = info.formatEntityComponentsData(true)
      
            if(entitydata.hasNewValues)
            {
                this.send("ENTITY_DATA", entitydata.data)
            }

            info.clearData("new")
        }
    }

    public get id() {return this._id}

    public send(key: string, data: any)
    {
        this._packetSender.send(key, data)
    }
}