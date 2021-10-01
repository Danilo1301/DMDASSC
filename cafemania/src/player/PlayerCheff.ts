import { World } from "@cafemania/world/World";
import { Player, PlayerType } from "./Player";

export class PlayerCheff extends Player {

    constructor(world: World) {
        super(world);

        this._spriteTexture = 'PlayerSpriteTexture_TestCheff';
        this._type = PlayerType.CHEFF;
    }
}