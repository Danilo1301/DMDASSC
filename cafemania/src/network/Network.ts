import GameClient from "@cafemania/game/GameClient";
import GameScene from "@cafemania/game/scene/GameScene";
import { io, Socket } from "socket.io-client";

export default class Network
{
    private _socket: Socket

    private _game: GameClient

    constructor(game: GameClient)
    {
        this._game = game

        const address = `${location.protocol}//${location.host}/api/cafemania`
        
        this._socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        })

        this.setupSocket()

        
    }

    private setupSocket()
    {
        const socket = this.getSocket()

        socket.on("connect", () => {
            this.drawTestMessage("connected", 0, 0)
        })

        socket.on("packet", packet => {

            const packetData = packet.packetData

            const game = this.getGame()
            const world = game.getWorlds()[0]
            const tileItemFactory = game.tileItemFactory

            for (const tileId in packetData.tiles)
            {
                const tile = packetData.tiles[tileId]

                const thisTile = world.addTile(tile.x, tile.y)

                for (const tileItem of tile.items)
                {
                    const thisTileItem = tileItemFactory.createTileItem(tileItem.tileItemInfo)

                    thisTileItem.setDirection(tileItem.direction)

                    world.putTileItemInTile(thisTileItem, thisTile)
                }

                
  
              
                console.log(tile)
            }

            for (const netPlayerId in packetData.players)
            {
                const netPlayer = packetData.players[netPlayerId]

        
                if(!world.hasPlayer(netPlayer.id))
                {
                    const player = world.createPlayer(netPlayer.id)

                    const atTile = world.getTile(netPlayer.atTile.x, netPlayer.atTile.y)

                    player.setAtTile(atTile)
                }

                

                console.log(netPlayer)

                const player = world.getPlayer(netPlayer.id)


                if(netPlayer.targetTile)
                {
                    const targetTile = world.getTile(netPlayer.targetTile.x, netPlayer.targetTile.y)

                    if(targetTile != player.getAtTile())
                        player.taskWalkToTile(targetTile)
                }

                //const thisPlayer = world.getPlayer(player.id)
                
                
                
            }
            //this.drawTestMessage(JSON.stringify(packet), 0, 0)
        })
    }

    public drawTestMessage(text: string, x: number, y: number, color?: string)
    {
        GameScene.getScene().drawWorldText(text, new Phaser.Math.Vector2(x, y), color)
    }

    public connect()
    {
        return

        this.drawTestMessage("connecting...", 0, 0)

        this.getSocket().connect()
    }

    public getSocket()
    {
        return this._socket
    }

    public getGame()
    {
        return this._game
    }
}