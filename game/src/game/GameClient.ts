import { Game } from "@game/game/Game";
import Network from "@game/network/Network";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { MainScene } from "@game/scenes/MainScene";

export class GameClient extends Game {

    private _network: Network

    constructor() {
        super();

        this._network = new Network(this)
    }

    public get network() { return this._network; }

    public async start() {
        console.log(`[GameClient] Start`);

        const phaser = await SceneManager.createPhaserInstance(this);
        phaser.events.on('step', (time: number, delta: number) => this.updateServers(delta));

        console.log(`[GameClient] Phaser started`);

        SceneManager.startScene('MainScene', MainScene);
    
        window['SceneManager'] = SceneManager;
    }
}