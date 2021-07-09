import GameClient from "../GameClient";
import LocalPlayer from "../LocalPlayer";

export default class ServersScene extends Phaser.Scene
{
    public Game!: GameClient
    
    public init(data) {
        this.Game = data.game
    }

    public preload()
    {

    }

    public create()
    {
        this.cameras.main.setBackgroundColor(0x161616)

        var game = this.Game
        var network = game.getNetwork()

        var centerX = this.cameras.main.centerX

        network.events.on("RECEIVED_PACKET:SERVERS_LIST", (packetData) => {
            
            var i = 0;

            for (const server of packetData.servers) {
                var r = this.add.rectangle(centerX, 60 + i * 60, 500, 50, 0x333)
                this.add.text(centerX, 60 + i * 60, `${server.id} (${server.players} players)`)

                r.setInteractive()

                r.on("pointerup", () => {
                    console.log(server.id)

                    network.send("CONNECT_TO_SERVER", {id: server.id})
                })

                i++;
            }
        })

        network.events.on("RECEIVED_PACKET:JOIN_SERVER_STATUS", (status) => {
            console.log('JOIN_SERVER_STATUS', status)

            if(status.success)
            {
                LocalPlayer.setEntityId(status.entityId)

                game.startMultiplayerWorld()
                this.scene.remove('ServersScene')
            }
        })

        network.send("GET_SERVERS_LIST", {})

        
    }
}