import Game from "@cafemania/game/Game"
import TileTextureFactory from "@cafemania/tileItem/TileTextureFactory";
import GameScene from "./scene/GameScene";

export default class GameClient extends Game
{
    public async start(): Promise<void>
    {
        await super.start()

        this.setGameScene(this.startScene('GameScene', GameScene));

        this.events.on("ready", this.onReady.bind(this))
    }

    private onReady()
    {
        TileTextureFactory.init(this, this.getGameScene())

        const world = this.createWorld()

        
    }
}