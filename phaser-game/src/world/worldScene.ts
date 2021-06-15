import { World } from "@phaserGame/world"

export class WorldScene extends Phaser.Scene {
    public World!: World

    init(data) {
        this.World = data.world
    }

    create() {
        this.World.Scene = this
        this.World.Awake()
    }
}