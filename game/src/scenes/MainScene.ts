import { GameClient } from "@game/game/GameClient";
import LocalPlayer from "@game/network/LocalPlayer";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "./GameScene";
import ServerListScene from "./ServerListScene";

export class MainScene extends Phaser.Scene {

    public graph1!: Phaser.GameObjects.Graphics

    preload() {
        this.load.setPath('/static/game/assets/')
        this.load.image('roof', 'roof.png')
        this.load.image('grass', 'grass.png')
    }

    startMultiplayer() {
        LocalPlayer.isMultiplayer = true;

        const game = SceneManager.game as GameClient;
        const network = game.network;
    
        network.initialize();
        network.events.on('connect', () => {
            SceneManager.startScene('ServerListScene', ServerListScene);
        });
        game.network.connect();
    }
    

    create() {
        console.log(`[MainScene] Create`)

        const btn = this.add.image(200, 100, 'roof').setInteractive();

        btn.on('pointerup', () => {
            btn.destroy();
            this.startMultiplayer()
        })

        return;

        for (let iy = 0; iy < 4; iy++) {
            for (let ix = 0; ix < 6; ix++) {
                
                const m = 4

                const pos = this.getGridPos(ix*m, iy*m)
                const grass = this.add.image(pos.x, pos.y, 'grass')
                grass.setOrigin(0)
                grass.setDisplaySize(50*m, 50*m)
            }
            
            
        }

        const pos = this.getGridPos(3, 3)
        const house = this.add.graphics()
        house.fillStyle(0xcccccc)
        house.fillRect(pos.x, pos.y, 150, 150)
        house.fillStyle(0x474747)
        house.fillRect(pos.x + 3, pos.y + 3, 150 - 6, 150 - 6)

        this.add.image(pos.x, pos.y, 'roof').setOrigin(0)

        this.graph1 = this.add.graphics()
        this.graph1.fillStyle(0xffffff, 0.5)
        this.graph1.fillRect(0, 0, 50, 50)
        
        this.events.emit('ready');
    }
    
    getGridPos(x: number, y: number)
    {
        return {
            x: x * 50,
            y: y * 50
        }
    }

    update(time: number, delta: number) {

        

        return;

        const position = {x: this.input.x, y: this.input.y}
        
        const gridPosistion = {
            x: position.x - (position.x % 50),
            y: position.y - (position.y % 50)
        }

        this.graph1.setPosition(gridPosistion.x, gridPosistion.y)
    }
}