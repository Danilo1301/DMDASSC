import { GameClient } from "@game/game/GameClient";
import LocalPlayer from "@game/network/LocalPlayer";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "./GameScene";

export default class ServerListScene extends Phaser.Scene
{
    public preload() {
    }

    public create()
    {
        this.cameras.main.setBackgroundColor(0x161616);

        const game = SceneManager.game as GameClient
        const network = game.network;

        const centerX = this.cameras.main.centerX

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

                GameScene.setupEmptyWorld(() => {
                    this.scene.remove('ServerListScene');

                    console.log(`[ServerListScene] Stop`)
                });
            }
        })

        network.send("GET_SERVERS_LIST", {})

        
    }
}