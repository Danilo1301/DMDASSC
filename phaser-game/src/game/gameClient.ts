import { Game } from "@phaserGame/game"
import { Input } from "@phaserGame/input"
import { Server } from "@phaserGame/server"
import { MainMenuScene } from "@phaserGame/game/scenes/mainMenuScene"
import { Network } from "@phaserGame/network"
import { InputHandlerComponent, PhysicBodyComponent, PositionComponent } from "@phaserGame/components"
import { InventoryGui } from "@phaserGame/inventoryGui/inventoryGui"

export class GameClient extends Game {
    public PhaserGame!: Phaser.Game
    public Scene!: Phaser.Scene

    public get Server(): Server { return this.Servers[0] }

    public Start(): void {
        super.Start()

        console.log(`[Game] Starting Client...`)

        console.log(`[Game] Starting Phaser...`)

       
        this.PhaserGame = this.CreatePhaserInstance()

        this.PhaserGame.events.on('ready', this.OnReady.bind(this))
    }

    public OnReady() {
        super.OnReady()

        this.Scene = this.PhaserGame.scene.getAt(0)!

        Network.Setup()
        Input.Setup(this.Scene.input)

        InventoryGui.Setup(this)

        this.Scene.events.on("update", Network.Update, Network)

        this.PhaserGame.scene.add('MainMenuScene', MainMenuScene, true, {game: this})
        
        var game = this.PhaserGame
        var scene = this.Scene

        var FKey = scene.input.on("pointerup", function () {

            if (scene.scale.isFullscreen)
            {
 
                //scene.scale.stopFullscreen();
            }
            else
            {

                //scene.scale.startFullscreen();
            }

        }, this);
    }


    public StartSinglePlayer() {
        this.CreateServer('server')
        this.Server.Start()

        var world = this.Server.Worlds[0]

        var player = world.EntityFactory.CreateEntity("EntityPlayer", {autoActivate: true})
        player.GetComponent(InputHandlerComponent).ControlledByPlayer = true
        console.log(player)

        
        var camera =  this.Scene.cameras.main
        camera.startFollow(player.GetComponent(PhysicBodyComponent).DefaultBody!.position, false, 0.1, 0.1)

        camera.setZoom(1.5)
 
    }

    public StartMultiplayer() {

        Network.Connect()
        Network.Events.on("connect", () => {

            Network.Send("join_server", {id: "server1"})
            Network.Events.on('received_packet:join_server_status', data => {
                console.log(data)

                this.CreateServer('server', true)
                this.Server.Start()
            
                this.Server.Events.on("world_start", () => {
                    console.log("server ready")
                })
        
            })
        })
    }
}