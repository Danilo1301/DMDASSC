import Game from "@cafemania/game/Game"
import SceneManager from "./SceneManager"

export default class GameServer extends Game
{
    constructor()
    {
        super()

        SceneManager.setHeadless(true)
    }

    public async start(): Promise<void>
    {
        this.events.on("ready", () => {
            console.log("game ready")
        })

        await super.start()
    }
}