import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { HudScene } from "./HudScene";

export class GameScene extends Phaser.Scene {

    public static Instance: GameScene;

    constructor() {
        super({});

        GameScene.Instance = this;
    }

    public static setupEmptyWorld(callback: () => void) {
        SceneManager.gameScene = SceneManager.startScene('GameScene', GameScene);
        SceneManager.startScene('HudScene', HudScene);

        GameScene.Instance.scene.sendToBack('GameScene');

        const game = SceneManager.game;

        const server = game.createServer();
        server.start();

        const world = server.createWorld();

        world.events.on('ready', () => {
            console.log('[MainScene] World loaded');

            callback();
        });

        world.start();
    }

    create() {
        console.log(`[GameScene] Create`)

        Input.setup(this);

        this.cameras.main.setBackgroundColor(0x000000);
    }

    update(time: number, delta: number) {
    }
}