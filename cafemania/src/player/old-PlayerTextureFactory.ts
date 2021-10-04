import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import Three, { ThreeModel } from "@cafemania/three/Three";
import { IPlayerAnim, PlayerAnimation } from './PlayerAnimation';
import { MainScene } from '@cafemania/scenes/MainScene';
import { SpriteSheetOrganizer } from '@cafemania/utils/SpriteSheetOrganizer';
import { Direction } from '@cafemania/utils/Direction';
import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { ClothingType } from './PlayerClothesFactory';

interface IPlayerTextureOptions {
    head?: string[]
    body?: string[]
    leg?: string[]
    animations: string[]
}

interface IQueryItem {
    callback: () => void
    name: string
    options: IPlayerTextureOptions
}

export class PlayerTextureFactory {
    
    private static _canvas: Phaser.Textures.CanvasTexture
    private static _cachedTextures: Phaser.Textures.CanvasTexture[] = []
    private static _query: IQueryItem[] = []
    private static _running: boolean = false

    private static _playerModel: ThreeModel
    private static _hairModel?: ThreeModel
    private static _shoesLModel?: ThreeModel
    private static _shoesRModel?: ThreeModel

    private static _hairColor?: string;
    private static _skinColor: string = "gray";

    private static _equipedClothes = new Map<ClothingType, string>();

    public static async init(textureName: string) {

        
        const canvas = SceneManager.phaser.textures.createCanvas(textureName, Three.size.x, Three.size.y);
        canvas.context.fillStyle = "green";
        canvas.context.fillRect(0, 0, Three.size.x, Three.size.y);
        canvas.refresh();
        
        await Three.init();
        
        await this.equipClothing(ClothingType.HAIR, 'hair1');
        await this.equipClothing(ClothingType.SHOES, 'shoes1');
        
        this._canvas = canvas;

        this._playerModel = await Three.loadGLTFModel('/static/cafemania/assets/models/player.glb', true)
        this._playerModel.object.position.set(0, 0.7, 0);
        Three.setAnimationFrame(this._playerModel, 3, 3);

        
  
        /*
        var i = 0;
        setInterval(async () => {

            Three.scene.remove(this._hairModel!.object);
            Three.scene.remove(this._shoesLModel!.object);

            
            var a = i == 0 ? 'hair/1' : 'hair/2';
            var b = i == 0 ? 'shoes/1' : 'hair/1';
            
            console.log(a, b)

            this._hairModel = await Three.loadGLTFModel('/static/cafemania/assets/models/'+a+'.glb')
            this._shoesLModel = await Three.loadGLTFModel('/static/cafemania/assets/models/'+b+'.glb')
            
            i++;

            if( i >= 2) i = 0
        }, 1000);
        */
        
        

        console.log("ready")
        /*
        const gltf = this._gltf = await Three.loadGLTFModel('/static/cafemania/assets/player/player.glb')

        this._mixer = new THREE.AnimationMixer( gltf.scene );
        this._clip = gltf.animations[0]

        const anim = this._anim = this._mixer.clipAction(this._clip)
                
        anim.reset()
        anim.play()

        Three.animate()

        const textureManager = MainScene.Instance.game.textures
        this._canvas = textureManager.createCanvas('_PlayerTextureFactoryCanvas', Three.size.x, Three.size.y)

        */
    }

    public static setSkinToObject(object: THREE.Object3D, skin: string[]) {
        const texture = this.mixTextures(skin, 1024, 831)

        object.traverse(o => {
            if(o instanceof THREE.Mesh) {
                o.material.map = texture
            }
        })
    }

    public static setSkinColor(color: number) {

    }

    public static setHairColor(color: string) {
        const textureName = 'PlayerTextureFactory_HairCanvas';

        if(SceneManager.phaser.textures.exists(textureName)) {
            SceneManager.phaser.textures.get(textureName).destroy();
        }

        const canvas = SceneManager.phaser.textures.createCanvas(textureName, 20, 20);
        canvas.context.fillStyle = color;
        canvas.context.fillRect(0, 0, 20, 20);
        canvas.refresh();

        this.setSkinToObject(this._hairModel!.object, [textureName])
    }

    public static async equipClothing(type: ClothingType, id: string) {
        console.log(`[PlayerTextureFactory] Equiping '${id}' at ${type}`);
        this._equipedClothes.set(type, id);

        const clothing = SceneManager.game.playerClothesFactory.get(id);

        console.log(clothing.texture)

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

            this.setSkinToObject(this._shoesLModel.object, ['player/body1'])
            this.setSkinToObject(this._shoesRModel.object, ['player/body1'])
        }
    }

    public static setAngle(angle: number) {
        Three.setAngle(this._playerModel, angle);
    }

    public static setAnimationFrame(frame: number) {
        Three.setAnimationFrame(this._playerModel, frame, this.getTotalAnimFrames())
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

    public static async create(name: string, options: IPlayerTextureOptions)
    {
        return new Promise<void>(resolve =>
        {
            let queryItem: IQueryItem = {
                callback: resolve,
                name: name,
                options: options
            }

            this._query.push(queryItem)

            this.process()
        })
    }

    private static angleFromDirection(direction: Direction) {
        //0 east
        //-45 south east
        //-45*2 south
        //-45*3 south west
        //45 noth east
        //45*2 north

        //45*3 north west
        //45*4 west

        return [
            45*2,   //NORTH
            -45*2,    //SOUTH
            0,      //EAST
            45*4,   //WEST
            45*3,   //NORTH_WEST
            45,   //NORTH_EAST
            -45*3,    //SOUTH_WEST
            -45    //SOUTH_EAST
        ][direction]
    }

    public static getTotalAnimFrames() {
        let totalAnimFrames = 0;
        for (const animName in PlayerAnimation.Animations) totalAnimFrames += PlayerAnimation.Animations[animName].frames
        return totalAnimFrames;
    }

    private static async process() {
        if(this._running) {
            console.log("Running, wait")
            return
        }

        if(this._query.length == 0) {
            console.log("Query is empty")
            return
        }

        this._running = true

        const queryItem = this._query.splice(0, 1)[0]

        console.log("Started")

        //await this.init()

        //

        interface IFrame {
            imageData: ImageData
            frameKey: string
        }

        console.log(`[PlayerTextureFactory] Generating...`)

        window['Three'] = Three

        //

        let headTextures = queryItem.options.head || ['1x1white']
        let bodyTextures = queryItem.options.body || ['1x1white']
        let legTextures = queryItem.options.leg || ['1x1white']

        const head_texture = this.mixTextures(headTextures, 1024, 831)
        const body_texture = this.mixTextures(bodyTextures, 1024, 1024)
        const legs_texture = this.mixTextures(legTextures, 1024, 831)

        this._playerModel.object.traverse(o => {

            

            if(o instanceof THREE.Mesh)
            {
                console.log(o.material.name)

                o.material.map = head_texture
                
                /*
                if(o.material.name == "HeadMaterial") o.material.map = head_texture
                if(o.material.name == "BodyMaterial") o.material.map = body_texture
                if(o.material.name == "LegMaterial") o.material.map = legs_texture
                */
            }
        })
        //      

  
        this.setSkinToObject(this._playerModel.object.children[0].getObjectByName("Body")!, ['notexture'])
        this.setSkinToObject(this._playerModel.object.children[0].getObjectByName("Legs")!, ['player/head'])

        this._canvas.clear()

        const frames: IFrame[] = []
  
        let pastFrames = 0
     
        

        for (const animName in PlayerAnimation.Animations) {
            const anim = PlayerAnimation.Animations[animName]
            

            if(queryItem.options.animations.includes(animName)) {

                console.log('[PlayerTextureFactory]', `Anim ${animName}`)

                for (const direction of anim.directions)
                {
                    //console.log('[PlayerTextureFactory]', `Direction ${direction}`)

                    Three.setAngle(this._playerModel, PlayerTextureFactory.angleFromDirection(direction) || 0)

                    for (let frame = 0; frame < anim.frames; frame++)
                    {
                        //console.log('[PlayerTextureFactory]', `Frame ${frame} (${pastFrames + frame} / ${totalAnimFrames})`)

                        this.setAnimationFrame(pastFrames + frame);

                        this.animate()

                        //

                        this._canvas.clear()
                        this._canvas.context.drawImage(Three.renderer.domElement, 0, 0)   
                        
                        const imageData = this._canvas.getData(0, 0, Three.size.x, Three.size.y)

                        frames.push({
                            imageData: imageData,
                            frameKey: `${anim.name}_${direction}_${frame}`
                        })

                        //
                    }
                }
            }

            pastFrames += anim.frames
        }

        const sheet = new SpriteSheetOrganizer()

        frames.map((frame, index) => sheet.addItem(`${index}`, frame.imageData.width, frame.imageData.height))

        sheet.organize()

        const canvas = MainScene.Instance.textures.createCanvas(queryItem.name, sheet.width, sheet.height) 
        //canvas.context.fillStyle = "red"
        //canvas.context.fillRect(0, 0, canvas.width, canvas.height)

        canvas.add('MAIN', 0, 0, 0, canvas.width, canvas.height)


        frames.map((frame, index) =>
        {
            const position = sheet.getItemPosition(`${index}`)

            canvas.putData(frame.imageData, position.x, position.y)
            canvas.add(frame.frameKey, 0, position.x, position.y, frame.imageData.width, frame.imageData.height)

            //console.log(frame.frameKey)
        })

        canvas.refresh()

        this._cachedTextures.map(texture => texture.destroy())
        this._cachedTextures = []

        console.log("Completed")

        queryItem.callback()

        setTimeout(() => {
            this._running = false

            this.process()
        }, 0);
    }

    public static mixTextures(textures: string[], width: number, height: number) {
        const textureManager = MainScene.Instance.textures
        const canvasTexture = textureManager.createCanvas('tmp' + this._cachedTextures.length, width, height)

        for (const t of textures) {
            const texture = textureManager.get(t)

            canvasTexture.context.drawImage(texture.getSourceImage() as HTMLImageElement , 0, 0, width, height)
            
        }

        canvasTexture.refresh()

        const texture = new THREE.CanvasTexture(canvasTexture.getCanvas());
        texture.flipY = false;

        this._cachedTextures.push(canvasTexture)

        return texture
    }
}