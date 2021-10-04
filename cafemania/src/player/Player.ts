import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { Direction } from "@cafemania/utils/Direction";
import { World, WorldEvent, WorldType } from "@cafemania/world/World"
import { v4 as uuidv4 } from 'uuid';
import { PlayerAnimation } from "./PlayerAnimation";
import { TaskPlayAnim, TaskWalkToTile } from "./PlayerTasks";
import { TaskExecuteAction, PlayerTaskManager } from "./PlayerTaskManager";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";

export interface PlayerSerializedData {
    id: string
    x: number
    y: number
}

export enum PlayerState {
    IDLE,
    WALKING,
    SITTING,
    EATING
}

export enum PlayerType {
    NONE,
    CLIENT,
    WAITER,
    CHEFF
}

export class Player {
    
    public beginWalkTime: number = 0;
    public aproximattedTimeToWalk: number = 0;

    private _world: World;
    private _id: string;
    private _position = new Phaser.Math.Vector2();
    private _atTile!: Tile;
    private _state: PlayerState = PlayerState.IDLE;
    private _direction: Direction = Direction.NORTH;
    private _speed: number = 2.5; //1.8
    private _depth: number = 0;
    private _sittingAtChair: TileItemChair | undefined;
    private _destroyed: boolean = false;

    protected _type: PlayerType = PlayerType.NONE;
    protected _spriteTexture: string = "PlayerSpriteTexture_NoTexture";

    private _finalTargetTile: Tile | undefined;
    private _targetTile: Tile | undefined;
    private _targetTileDistance: number = 0;
    private _distanceMoved: number = 0;
    private _moveToTileCallback?: () => void;
    
    private _debugText?: Phaser.GameObjects.BitmapText;
    private _container?: Phaser.GameObjects.Container;
    private _sprite?: Phaser.GameObjects.Sprite;

    private _taskManager: PlayerTaskManager;
    private _animation: PlayerAnimation;

    constructor(world: World) {
        this._world = world;
        this._id = uuidv4();

        this._animation = new PlayerAnimation(this);
        this._taskManager = new PlayerTaskManager();

        this.setAtTile(world.getTile(0, 0));
    }

    public get speed() { return this._speed; }
    public get id() { return this._id; }
    public get type() { return this._type; }
    public get direction() { return this._direction; }
    public get state() { return this._state; }
    public get isSitting() { return this._state == PlayerState.SITTING; }
    public get isWalking() { return this._state == PlayerState.WALKING; }
    public get isEating() {return this._state == PlayerState.EATING; }
    public get taskManager() { return this._taskManager; }
    public get world() { return this._world; }

    public getChairPlayerIsSitting() { return this._sittingAtChair!; }

    public setState(state: PlayerState) { this._state = state; }

    public setId(id: string) { this._id = id; }

    public getSprite() { return this._sprite; }

    public onCreate() {
        this.log(`created`);
    }

    public getAtTile() { return this._atTile; }

    public setAtTile(tile: Tile) {
        this.setPosition(tile.getPosition());
        this._atTile = tile;
    }

    public getPosition() { return new Phaser.Math.Vector2(this._position.x, this._position.y); }

    public setPosition(position: Phaser.Math.Vector2) { this._position.set(position.x, position.y); }

    public taskWalkNearToTile(tile: Tile) {
        const tiles = tile.getAdjacentTiles().filter(tile => tile.isWalkable);
        const closestTile = Tile.getClosestTile(this.getPosition(), tiles);

        this.taskWalkToTile(closestTile.x, closestTile.y);
    }

    public sitAtChair(chair: TileItemChair) {
        this._sittingAtChair = chair;
        this._state = PlayerState.SITTING;

        chair.setPlayerSitting(this);
    }

    public liftUpFromChair() {
        const chair = this.getChairPlayerIsSitting();
        if(chair) {
            chair.setIsReserved(false);
            chair.setPlayerSitting(undefined);
        }
        
        this._sittingAtChair = undefined;
        this.setState(PlayerState.IDLE);
    }

    public update(delta: number) {
        this.taskManager.update(delta);

        this.handleMovement(delta);
        this.handleSittingAtChair()
    }

    private handleMovement(delta: number) {
        const targetTile = this._targetTile;

        if(!targetTile) return;

        const speed = this.speed;

        const ang = Phaser.Math.Angle.BetweenPoints(this._position, targetTile.getCenterPosition());

        const moveDir = new Phaser.Math.Vector2(
            Math.cos(ang),
            Math.sin(ang)
        ).normalize();

        const move = new Phaser.Math.Vector2(
            moveDir.x * speed * delta * 0.05,
            moveDir.y * speed * delta * 0.05
        );

        this._position.x += move.x;
        this._position.y += move.y;

        this._distanceMoved += move.length();

        if(this._distanceMoved >= this._targetTileDistance) {
            const atTile = this._atTile

            this.setPosition(targetTile.getPosition())

            this._atTile = targetTile

            this._targetTile = undefined
            
            if(this._atTile == this._finalTargetTile) {
                this._finalTargetTile = undefined

                this.setState(PlayerState.IDLE);
            }

            this._moveToTileCallback?.()
        }
    }

    private handleSittingAtChair() {
        const chair = this._sittingAtChair;
        if(!chair) return;
        
        this.setPosition(chair.getPosition())

        /*
        enum ChairRestPosDepth {
            IN_FRONT_OF_PLAYER = 1,
            BEHIND_OF_PLAYER = 6
        }
        this._depth = isBehind ? ChairRestPosDepth.BEHIND_OF_PLAYER : ChairRestPosDepth.IN_FRONT_OF_PLAYER
        */

        const isBehind = this.direction == Direction.SOUTH || this.direction == Direction.EAST

        this._depth = isBehind ? 6 : 1;
        this._direction = chair.direction;
    }

    public render(delta: number) {
        this.renderSpriteContainer();

        switch (this._state)
        {
            case PlayerState.EATING:
                this._animation.play('Eat')
                break
            case PlayerState.SITTING:
                this._animation.play('Sit')
                break
            case PlayerState.WALKING:
                this._animation.play('Walk')
                break
            default:
                this._animation.play('Idle')
        }

        this._animation.update(delta)
    }

    private renderSpriteContainer() {
        const scene = GameScene.Instance;

        if(!this._container) {
            this._container = scene.add.container(0, 0);

            scene.objectsLayer.add(this._container);

            this.createSprite();
        }

        this._container?.setPosition(this._position.x, this._position.y);
        this._container?.setDepth(this._position.y + this._depth);
    }

    private async createSprite(textureName?: string) {
        const scene = GameScene.Instance;
        
        if(textureName) {
            const PTF = await import("./PlayerTextureFactory");
            await PTF.PlayerTextureFactory.generatePlayerTexture(textureName, {animations: []}) ;
        } else {
            textureName = this._spriteTexture;
        }

        if(this._sprite) this._sprite.destroy();

        const sprite = this._sprite = scene.add.sprite(0, 30, textureName);
        sprite.setScale(1.05);
        sprite.setOrigin(0.5, 1);
        sprite.setFrame(`Idle_0_0`);
        this._container!.add(sprite);
    }

    public moveToTile(x: number, y: number, callback?: () => void) {
        const tile = this.world.getTile(x, y);
        const atTile = this._atTile;

        const dir = new Phaser.Math.Vector2(tile.x - atTile.x, tile.y - atTile.y).normalize();

        dir.x = Math.round(dir.x);
        dir.y = Math.round(dir.y);

        this._targetTile = tile;
        this._targetTileDistance = Phaser.Math.Distance.BetweenPoints(this._position, tile.getPosition());
        this._distanceMoved = 0;
        this._moveToTileCallback = callback;
        this._direction = Tile.getDirectionFromOffset(dir.x, dir.y);
        this._state = PlayerState.WALKING;
    }

    public setFinalTargetTile(tile: Tile) { this._finalTargetTile = tile }

    public taskWalkToTile(x: number, y: number, dontEnterTile?: boolean) {
        const task = new TaskWalkToTile(this, x, y, dontEnterTile);

        task.events.once("time", (aproxTime) => {
            this.aproximattedTimeToWalk = aproxTime;
        })

        this.taskManager.addTask(task)
    }

    public taskPlayAnim(anim: string, time: number) {
        this.taskManager.addTask(new TaskPlayAnim(this, anim, time))
    }

    public resetMovementAndTasks() {
        this.taskManager.clearTasks();

        this.setState(PlayerState.IDLE);
        this._targetTile = undefined;

        this.setAtTile(this._atTile);
    }

    public taskExecuteAction(action: () => void) {
        this.taskManager.addTask(new TaskExecuteAction(action));
    }

    public getClosestDoor() {
        const doors = this.world.getDoors();
        const tile = Tile.getClosestTile(this.getPosition(), doors.map(door => door.tile));

        return tile.getDoor()
    }

    public destroy() {
        if(this._destroyed) return;

        this._destroyed = true;

        if(this.isSitting) this.liftUpFromChair();

        this.world.removePlayer(this);

        this._container?.destroy();
        this._sprite?.destroy();

        if(this.type == PlayerType.CLIENT) this.world.events.emit(WorldEvent.PLAYER_CLIENT_DESTROYED, this);
    }

    public serialize() {
        const json: PlayerSerializedData = {
            id: this.id,
            x: this._atTile.x || 0,
            y: this._atTile.y || 0
        };
        return json;
    }

    public log(...args) {
        args.unshift(`[${this.constructor.name} : ${this.id}]`);
        console.log.apply(null, args);
    }
}