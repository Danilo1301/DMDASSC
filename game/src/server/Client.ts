import { GameServer } from '@game/game/GameServer';
import { v4 as uuidv4 } from 'uuid';
import socketio from 'socket.io';
import { Server } from './Server';
import { Entity } from '@game/entity/Entity';
import { EntityWatcher } from '@game/utils/EntityWatcher';
import { PacketSender } from '@game/utils/PacketSender';
import { SceneManager } from '@game/sceneManager/SceneManager';
import { Position } from '@game/components/Position';

export class Client
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
            var servers = this._game.servers
            var packetData: any = {servers: []}

            for (const server of servers) {
                packetData.servers.push({
                    id: server.id,
                    players: server.clients.length
                })
            }

            this._packetSender.send("SERVERS_LIST", packetData)
        })

        this._packetSender.events.on('RECEIVED_PACKET:CONNECT_TO_SERVER', (packet) => {
  
            var id = packet.id
            var server = this._game.getServer(id)

            server.handleClientConnection(this)

            this._server = server
            
        })

        this._packetSender.events.on('RECEIVED_PACKET:REQUEST_ACTION', (packet) =>
        {
            throw 'not yet';

            //this._server!.events.emit('REQUEST_ACTION', packet.action, packet.data, this.id)
        })

        this._packetSender.events.on('RECEIVED_PACKET:CLIENT_DATA', (data) =>
        {
     
            if(this._entity)
            {
                var position = this._entity.position

                position.set(data.position.x, data.position.y)

                //var physicBody = this._entity.getComponent(PhysicBodyComponent)
                //physicBody.setVelocity(data.velocity.x, data.velocity.y)
            }
            
        })

        
        socket.on("disconnect", () =>
        {
            //if(this._server) this._server.handleClientDisconnect(this)
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

        var world = server.worlds[0]

        if(!world) return

        for (const entity of world.entities)
        {
            var clientEntity = this._entity

            var clientPosition = {x: 0, y: 0}

            if(clientEntity)
            {
                var position = clientEntity.getComponent(Position)
                clientPosition.x = position.x
                clientPosition.y = position.y
            }

            var entityPosition = entity.getComponent(Position)

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