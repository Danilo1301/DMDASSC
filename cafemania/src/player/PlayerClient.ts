import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { TileItemDoor } from "@cafemania/tileItem/TileItemDoor";
import { Utils } from "@cafemania/utils/Utils";
import { World, WorldEvent, WorldType } from "@cafemania/world/World";
import { Player, PlayerState, PlayerType } from "./Player";

export class PlayerClient extends Player {

    private static MAX_FIND_CHAIR_ATTEMPTS = 5
    private static beginEatSoundIndex = 0;

    private _findChairAttempts: number = 0;
    private _attemptTime: number = 0;
    
    private _eatTime: number = (Math.random()*10000)+20000;
    private _eatTimeEnd: number = 0;
    private _hasStartedEating: boolean = false;

    private _goingToChair?: TileItemChair;
    private _goingToDoor?: TileItemDoor;

    private _isWaitingForWaiter: boolean = false;
    private _isWaitingForChair: boolean = false;
    private _exitingCafe: boolean = false;

    constructor(world: World) {
        super(world);

        this._spriteTexture = 'PlayerSpriteTexture_TestClient';
        this._type = PlayerType.CLIENT;
    }

    public get isExitingCafe() { return this._exitingCafe; }
    public get hasStartedEating() { return this._hasStartedEating; }
    public get isWaitingForWaiter() { return this._isWaitingForWaiter }
    public get eatTime() { return this._eatTime; }


    public static playBeginEatSound() {
        this.beginEatSoundIndex++;
        if(this.beginEatSoundIndex >= 4) this.beginEatSoundIndex = 0;
        
        console.log(this.beginEatSoundIndex)

        GameScene.Instance?.sound.play(`begin_eat${this.beginEatSoundIndex+1}`);
    }

    public render(delta: number) {
        super.render(delta);
    }

    public update(delta: number) {
        super.update(delta);

        //at door
        if(this._isWaitingForChair) {
            //no chair

            if(this.world.type == WorldType.DEFAULT) {
                this.processFindChairAttempts(delta);
            }

            if(this._goingToChair == undefined) {
                if(this.world.isWorldServer) this.processFindChairAttempts(delta);
                return;
            }

            //yes chair

            this._isWaitingForChair = false;
            this.beginWalkTime = Date.now();
            this.taskWalkToChair();
   
            if(this.world.isWorldServer) this.resetMovementAndTasks();
        }

        //going to chair
        if(this._goingToChair && this.isSitting) {
            this._goingToChair = undefined;

            if(this.world.isWorldClient) {
                this.log("Reached chair locally", WorldEvent.PLAYER_CLIENT_REACHED_CHAIR);
                this.world.events.emit(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, this);
            }
        }

        //sitting, not eating
        if(this.isSitting && !this.isEating) {
            const table = this.getChairPlayerIsSitting().getTableInFront();

            if(table) {
                if(!table.isEmpty()) {
                    this._hasStartedEating = true;
                    this._eatTimeEnd = Date.now() + this._eatTime;
                    this.setState(PlayerState.EATING);

                    PlayerClient.playBeginEatSound();
                }
            }
        }

        //when eating
        if(this.isEating) {
            let percent = 1 - ((this._eatTimeEnd - Date.now()) / this._eatTime);

            percent = Math.min(percent, 1);

            //console.log(percent)

            this.getChairPlayerIsSitting().getTableInFront()!.getDishPlate()?.setPercentage( percent );

            if(this.world.isWorldServer || this.world.type == WorldType.DEFAULT) {
                if(Date.now() >= this._eatTimeEnd) this.onFinishEating();
            }

        }
    }

    public finishEating() {
        this._eatTimeEnd = Date.now();

        this.onFinishEating();
    }

    private processFindChairAttempts(delta: number) {
        this._attemptTime += delta;

        if(this._attemptTime >= 300) {
            this._attemptTime = 0;
            this._findChairAttempts++;

            if(this._findChairAttempts >= PlayerClient.MAX_FIND_CHAIR_ATTEMPTS) {
                this.log("No more attempts");

                //DONT CHANGE THE ORDER AGAIN!!
                
                this.world.events.emit(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, this, undefined); //tells client to exit cafe
                this.exitCafe();
                return;
            }
          
            const result = this.tryFindAvaliableChair();

            if(result) {
                this.log("Attempt success");

                this.world.events.emit(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, this, this._goingToChair) //tells client to go to chair
                return;
            }
            
            this.log("Attempt failed");
        }
    }

    private onFinishEating() {
        this.log(`finish eating`);

        //
        this.log("tip");
        GameScene.Instance?.sound.play('audio_tip');
        const position = this.getChairPlayerIsSitting().getTableInFront()!.getDishPlate().getPosition();
        GameScene.Instance?.drawWorldText(`tip`, position, 0x000000)
        //

        const table = this.getChairPlayerIsSitting().getTableInFront()!;
        table.clearDish();
        //this.getChairPlayerIsSitting().setIsReserved(false)
        this.liftUpFromChair()
        this.exitCafe()

        
    }

    public warpToDoor() {
        this.log(`Warped to door`)
        const door = this._goingToDoor!;
        const tile = door.tile;
        this.setAtTile(tile);
        this._isWaitingForChair = true;
    }

    public taskWalkToChair() {
        const chair = this._goingToChair!;
        const tile = chair.tile;

        //fix client bug
        const playerSitting = chair.getPlayerSitting();
        if(playerSitting) (playerSitting as PlayerClient).finishEating();

        this.taskWalkToTile(tile.x, tile.y);
        this.taskExecuteAction(() => {
            this.warpToChair();
        })
    }

    public warpToChair() {
        this.log(`Warped to chair`);
        const chair = this._goingToChair!;
        this.sitAtChair(chair);
        this.setIsWaitingForWaiter(true);
    }

    public startClientBehavior() {
        this.log(`Started client behaviour`);

        this._goingToDoor = this.getClosestDoor()

        /*
        if(!this.world.isWorldClient) {
            const result = this.tryFindAvaliableChair()

            if(result) this.world.events.emit(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, this, this._goingToChair);
        }
        */

        this.beginWalkTime = Date.now();

        this.log(`Walking to door`);

        this.taskWalkToDoor();

        if(this.world.isWorldServer) this.resetMovementAndTasks()
    }

    public taskWalkToDoor() {
        const door = this._goingToDoor!;
        const tile = door.tile;

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => {
            if(this.world.isWorldClient) this.world.events.emit(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, this);

            this.warpToDoor();
        })
    }

    public tryFindAvaliableChair() {
        this.log(`Try find chair`);

        const chairs = this.world.getChairs(true);

        if(chairs.length == 0) return false;

        const chair = Utils.shuffleArray(chairs)[0];
        chair.setIsReserved(true);

        this.setGoingToChair(chair);

        return true;
    }

    public setIsWaitingForWaiter(value: boolean) {
        this._isWaitingForWaiter = value;
    }

    public setEatTime(time: number) {
        this._eatTime = time;
    }

    public setGoingToChair(chair: TileItemChair) {
        this.log(`Setted going to chair`);

        this._goingToChair = chair;
    }

    public exitCafe() {
        this._exitingCafe = true;

        this.log(`Exit cafe`);

        this.world.events.emit(WorldEvent.PLAYER_CLIENT_EXITED_CAFE, this);

        if(this.world.isWorldServer) {
            this.destroy();
            return;
        }

        const world = this.world;
        const tile = Tile.getClosestTile(this.getPosition(), [world.getLeftSideWalkSpawn(), world.getRightSideWalkSpawn()]);

        this.taskWalkToTile(tile.x, tile.y);
        this.taskExecuteAction(() => this.destroy());
    }

    public destroy() {
        super.destroy();

        this._goingToChair?.setIsReserved(false);
    }
}