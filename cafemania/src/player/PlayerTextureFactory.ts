import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import Three, { ThreeModel } from "@cafemania/three/Three";
import { IPlayerAnim, PlayerAnimation } from './PlayerAnimation';
import { MainScene } from '@cafemania/scenes/MainScene';
import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { ClothingType } from './PlayerClothesFactory';
import { IPlayerTextureOptions, PlayerTextureGenerator } from './PlayerTextureGenerator';



export class PlayerTextureFactory {
   
    private static _playerModel: ThreeModel
    private static _hairModel?: ThreeModel
    private static _shoesLModel?: ThreeModel
    private static _shoesRModel?: ThreeModel
    
    private static _canvas: Phaser.Textures.CanvasTexture
    private static _skinColor: string = 'white';
    private static _equipedClothes = new Map<ClothingType, string>();

    public static get canvas() { return this._canvas; }

    public static async init(textureName: string) {
        console.log(`[PlayerTextureFactory] Init`);

        const textureManager = SceneManager.phaser.textures;

        const canvas = textureManager.createCanvas(textureName, Three.size.x, Three.size.y);
        canvas.context.fillStyle = "green";
        canvas.context.fillRect(0, 0, Three.size.x, Three.size.y);
        canvas.refresh();
        this._canvas = canvas;
        
        await Three.init();
    
        const playerModel = await Three.loadGLTFModel('/static/cafemania/assets/models/player.glb', true)
        playerModel.object.position.set(0, 0.7, 0);
        this._playerModel = playerModel;
        //Three.setAnimationFrame(playerModel, 0, 3);

        console.log(`[PlayerTextureFactory] Finish init`);

        //this._hairTexture = textureManager.createCanvas('PlayerTextureFactory_HairTexture', 1);
        //this._skinTexture = textureManager.createCanvas('PlayerTextureFactory_SkinTexture', 1);

        await this.equipDefaultClothes();
    }

    private static async equipDefaultClothes() {

        this._equipedClothes.clear();

        await this.equipClothing(ClothingType.HAIR, 'hair1');
        await this.equipClothing(ClothingType.SHOES, 'shoes1');
    }
    
    public static async equipClothing(type: ClothingType, id: string) {
        console.log(`[PlayerTextureFactory] Equiping '${id}' at ${type}`);

        this._equipedClothes.set(type, id);

        const textureManager = SceneManager.phaser.textures;
        const clothing = SceneManager.game.playerClothesFactory.get(id);

        if(type == ClothingType.HAIR) {
            if(this._hairModel) Three.scene.remove(this._hairModel.object);

            this._hairModel = await Three.loadGLTFModel('/static/cafemania/assets/models/' + clothing.model + '.glb')


            //if(this._hairColor) this.setHairColor(this._hairColor);


            //this.setSkinToObject(this._hairModel.object, ['player/body1'])



        }

        if(type == ClothingType.SHOES) {
            if(this._shoesLModel) Three.scene.remove(this._shoesLModel.object);
            if(this._shoesRModel) Three.scene.remove(this._shoesRModel.object);

            this._shoesLModel = await Three.loadGLTFModel('/static/cafemania/assets/models/' + clothing.model + '.glb')
            this._shoesRModel = await Three.loadGLTFModel('/static/cafemania/assets/models/' + clothing.model + '.glb')

            
            if(textureManager.exists('PlayerTextureFactory_ShoesTexture')) textureManager.get('PlayerTextureFactory_ShoesTexture').destroy();
            this.applyTextureToObject(this.createMixedTexture('PlayerTextureFactory_ShoesTexture', [textureManager.get(clothing.texture)!], 50, 50), this._shoesLModel.object)

        }
    }
    
    public static setHairColor(color: string) {

        if(!this._hairModel) return;

        const texture = this.createPixelColorTexture('test_hair', color);
        this.applyTextureToObject(texture, this._hairModel.object);
    }

    public static async generateTempSkin(name: string, textures: Phaser.Textures.Texture[], width: number, height: number) {
        const textureManager = SceneManager.phaser.textures;
        
        if(textureManager.exists(name)) textureManager.get(name).destroy();
        
        return await this.createMixedTexture(name, textures, width, height);
    }

    public static async updateBodySkins() {
        const textureManager = SceneManager.phaser.textures;

        console.log(this._equipedClothes)

        if(textureManager.exists('PlayerTextureFactory_SkinTexture')) textureManager.get('PlayerTextureFactory_SkinTexture').destroy();
        const skinTexture = await this.createPixelColorTexture('PlayerTextureFactory_SkinTexture', this._skinColor);

        const headTexture = await this.generateTempSkin('PlayerTextureFactory_HeadTexture', [skinTexture, textureManager.get('player/eye')!], 300, 300)
        const bodyTexture = await this.generateTempSkin('PlayerTextureFactory_BodyTexture', [skinTexture, textureManager.get('player/body2')!], 300, 300)
        const legsTexture = await this.generateTempSkin('PlayerTextureFactory_LegsTexture', [skinTexture, textureManager.get('player/eye')!], 300, 300)

        await this.applyTextureToObject(headTexture, this._playerModel.object.children[0].getObjectByName("Head_1")!)
        await this.applyTextureToObject(bodyTexture, this._playerModel.object.children[0].getObjectByName("Body")!)
        await this.applyTextureToObject(legsTexture, this._playerModel.object.children[0].getObjectByName("Legs")!)

   
        console.log("updated")

        //skinTexture.destroy();
        //headTexture.destroy();
    }

    public static async setSkinColor(color: string) {
        if(!this._playerModel) return;

        this._skinColor = color;

        await this.updateBodySkins();

        return;

        const texture = this.createPixelColorTexture('test_skin', color);
        this.applyTextureToObject(texture, this._playerModel.object);
    }

    public static setAngle(angle: number) {
        Three.setAngle(this._playerModel, angle);
    }

    public static setAnimationFrame(frame: number) {
        Three.setAnimationFrame(this._playerModel, frame, this.getTotalAnimFrames())
    }

    
    private static createPixelColorTexture(textureName: string, color: string) {
        if(SceneManager.phaser.textures.exists(textureName)) { SceneManager.phaser.textures.get(textureName).destroy(); }

        const canvas = SceneManager.phaser.textures.createCanvas(textureName, 1, 1);
        canvas.context.fillStyle = color;
        canvas.context.fillRect(0, 0, 1, 1);
        canvas.refresh();

        return canvas;
    }

    private static createMixedTexture(name: string, textures: Phaser.Textures.Texture[], width: number, height: number) {
        const textureManager = MainScene.Instance.textures
        const canvasTexture = textureManager.createCanvas(name, width, height)

        for (const t of textures) {
            const texture = textureManager.get(t)
            canvasTexture.context.drawImage(texture.getSourceImage() as HTMLImageElement , 0, 0, width, height)
        }

        canvasTexture.refresh()
        
        return canvasTexture;
    }

    private static async applyTextureToObject(texture: Phaser.Textures.CanvasTexture, object: THREE.Object3D) {
        
        const threeTexture = new THREE.CanvasTexture(texture.getCanvas());
        threeTexture.flipY = false;

        await this.applyThreeTextureToObject(threeTexture, object);
    }

    private static async applyThreeTextureToObject(texture: THREE.CanvasTexture, object: THREE.Object3D) {
        await object.traverse(o => {
            if(o instanceof THREE.Mesh) {
                o.material.map = texture;
            }
        })
    }


    public static animate() {
        const playerModel = this._playerModel;
        const feetLBone = playerModel.object.children[0].children[0].children[1].children[0].children[0];
        const feetRBone = playerModel.object.children[0].children[0].children[2].children[0].children[0];
        const hairBone = playerModel.object.children[0].children[0].children[0].children[0].children[0];

        if(this._shoesLModel) Three.setModelToObject(this._shoesLModel, feetLBone);
        if(this._shoesRModel) Three.setModelToObject(this._shoesRModel, feetRBone);
        if(this._hairModel) Three.setModelToObject(this._hairModel, hairBone);

        Three.animate();

        const canvas = this._canvas;
        canvas.clear();
        canvas.context.drawImage(Three.renderer.domElement, 0, 0);
        canvas.refresh();
    }

    public static getTotalAnimFrames() {
        let totalAnimFrames = 0;
        for (const animName in PlayerAnimation.Animations) totalAnimFrames += PlayerAnimation.Animations[animName].frames
        return totalAnimFrames;
    }

    public static async generatePlayerTexture(name: string, options: IPlayerTextureOptions) {
        await PlayerTextureGenerator.generate(name, options)
    }
}