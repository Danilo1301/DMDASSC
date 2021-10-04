import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { Direction } from "@cafemania/utils/Direction";
import { TileItem } from "./TileItem";
import { TileItemInfo, TileItemType } from "./TileItemInfo";

export class TileItemWallDecoration extends TileItem {

    constructor(tileItemInfo: TileItemInfo) {
        super(tileItemInfo);
    }

    public render(delta: number) {
        super.render(delta);
    }
}