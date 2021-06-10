import { World } from "@phaserGame/world"

export class WorldScene extends Phaser.Scene {
    public World!: World

    preload() {
        this.World.Preload()
    }

    create() {
        this.World.Create()
    }

    update(time: number, delta: number) {
        this.World.Update(delta)
    }
}