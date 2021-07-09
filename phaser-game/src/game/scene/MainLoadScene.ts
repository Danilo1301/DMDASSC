import GameClient from "../GameClient";

export default class MainLoadScene extends Phaser.Scene
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
        this.cameras.main.setBackgroundColor(0xff00ff)

        var game = this.Game
        var network = game.getNetwork()

        network.events.once("connect", () => {
            game.startMainMenuScene()
        })

        network.connect()
    }
}