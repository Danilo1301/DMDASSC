import { EntityDebug } from "@game/components/EntityDebug";
import { InputHandler } from "@game/components/InputHandler";
import { Position } from "@game/components/Position";
import { RandomMovement } from "@game/components/RandomMovement";
import { BaseEntity } from "@game/entity/BaseEntity";
import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { EntityChar } from "@game/entity/entityChar/EntityChar";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { Server } from "@game/server/Server";
import { v4 as uuidv4 } from 'uuid';

export interface ICreateEntityOptions {
    id?: string
}

export class World extends BaseEntity {
    public events = new Phaser.Events.EventEmitter()
    private _id: string;
    private _entities = new Phaser.Structs.Map<string, Entity>([])
    private _scene?: Phaser.Scene
    private _server: Server

    constructor(server: Server) {
        super();

        this._server = server;
        this._id = uuidv4();
    }

    public get id() { return this._id; }
    public get entities() { return this._entities.values(); }
    public get scene() { return this._scene!; }
    public get server() { return this._server; }

    public async start() {
        console.log(`[World] Starting...`)

        const gameScene = SceneManager.gameScene;

        if(gameScene) this._scene = gameScene;
        else await this.createScene();

        this.setupEvents();

        console.log(`[World] Started`)

        this.events.emit('ready');
    }

    public setupBaseWorld() {

        this.createBot(0, 0)
        this.createBot(0, 0)
        this.createBot(0, 0)

    }

    private createBot(x: number, y: number) {
        const entity = this.addEntity(
            new EntityChar(this),
            [
                new RandomMovement()
            ]
        );

        entity.position.set(x, y);
    }

    public update(delta: number) {
        super.update(delta);
        
        for (const entity of this.entities) entity.update(delta)
    }

    public createEntity(entityType: string, options: ICreateEntityOptions) {
        //var constr = this.getEntityByName(entityType)
        var constr = EntityChar;

        if(!constr) throw new Error("Invalid Entity Type '" + entityType + "'");
        
        var id = options.id == undefined ? ("ENTITY-" + uuidv4()) : options.id

        var entity = new constr(this);
        entity.setId(id);

        return entity
    }

    public hasEntity(id: any) {
        return this._entities.has(id);
    }

    public getEntity(id: any) {
        return this._entities.get(id);
    }

    public addEntity(entity: Entity, components?: Component[]) {
        console.log('[World]', `Add entity ${entity.constructor.name}`);
        this._entities.set(entity.id, entity);

        if(components != undefined) {
            for (const component of components) {
                entity.addComponent(component);
            }
        }
        
        entity.start();
        return entity;
    }

    public destroyEntity(entity: Entity) {
        console.log('[World]', `Destroy entity ${entity.constructor.name}`);
        this._entities.delete(entity.id);

        entity.destroy();
    }

    private async createScene() {
        const phaser = await SceneManager.createPhaserInstance();
        this._scene = phaser.scene.getScenes()[0];
    }

    private setupEvents() {
        this.scene.events.on('update', (time: number, delta: number) => this.update(delta));
    }
}