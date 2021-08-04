import { Direction, Directions } from "@cafemania/utils/Direction";
import SceneManager from "@cafemania/game/SceneManager";
import Three from "@cafemania/three/Three";
import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import PlayerAnimations from "./PlayerAnimations";

interface QueryItem
{
    callback: () => void
    name: string
    options: PlayerTextureOptions
}

interface PlayerTextureOptions
{
    default?: boolean
}

export default class PlayerTextureFactory
{
    private static _gltf?: GLTF
    
    private static _mixer: THREE.AnimationMixer
    private static _anim: THREE.AnimationAction
    private static _clip: THREE.AnimationClip

    private static _cachedTextures: Phaser.Textures.CanvasTexture[] = []

    private static _query: QueryItem[] = []
    private static _running: boolean = false

    private static _spritesDirections = [
        {
            angle: -45,
            name: "Front"
        },
        {
            angle: 0,
            name: "FrontIso"
        },
        {
            angle: 45,
            name: "Side"
        },
        {
            angle: 45*3,
            name: "Back"
        },
        {
            angle: 45*4,
            name: "BackIso"
        }
    ]

    public static async init()
    {
        if(this._gltf) return

        //console.log(this._gltf)

        const gltf = this._gltf = await Three.loadGLTFModel('/static/cafemania/assets/char.glb')

        //console.log(this._gltf)

        this._mixer = new THREE.AnimationMixer( gltf.scene );
        this._clip = gltf.animations[0]

        const anim = this._anim = this._mixer.clipAction(this._clip)
                
        anim.reset()
        anim.play()

        Three.animate()
    }

    public static setAnimFrame(frame: number, totalFrames: number)
    {
        /*
        console.log(this._clip.duration)

        this._anim.time = frame * (this._clip.duration / totalFrames)
        this._mixer.update(0)

        console.log(`setAnimFrame`, frame, totalFrames, this._clip.duration / totalFrames * (frame), this._clip.duration)
        */
        const timeInSeconds = frame * ((this._clip.duration - (this._clip.duration*0.01)) / (totalFrames-1))
        const animMixer: any = this._mixer
        
        //console.log(this._clip.duration)


        animMixer.time=0;
            for(var i=0;i<animMixer._actions.length;i++){
            animMixer._actions[i].time=0;
        }
        animMixer.update(timeInSeconds)
    }

    private static sleep(t: number)
    {
        return new Promise<void>(resolve => {
            setTimeout(() => resolve(), t);
        })
    }

    private static async process()
    {
        if(this._running)
        {
            console.log("Running, wait")
            return
        }

        if(this._query.length == 0)
        {
            console.log("Query is empty")
            return
        }

        this._running = true

        const queryItem = this._query.splice(0, 1)[0]

        console.log("Started")

        await this.init()

        //
        let t: string[] = []

        if(Math.random() > 0.5)
        {
            t.push('body2')
        } else {
            t.push('body1')
        }
        //

        const headTextures: string[] = []
        const bodyTextures: string[] = []
        const legTextures: string[] = []

        if(queryItem.options.default === true)
        {
            headTextures.push('1x1white')
            bodyTextures.push('1x1white')
            legTextures.push('1x1white')
        } else {
            headTextures.push('head')
            bodyTextures.push('body2')
            legTextures.push('head')
        }

        var t1 = performance.now()

            
        const head_texture = this.mixTextures(headTextures, 1024, 831)

        await this.sleep(queryItem.options.default === true ? 0 : 100)

        const body_texture = this.mixTextures(bodyTextures, 1024, 1024)

        await this.sleep(queryItem.options.default === true ? 0 : 100)

        const legs_texture = this.mixTextures(legTextures, 1024, 831)

  

        //console.log(performance.now() - t1)

        this._gltf!.scene.traverse(o => {

            if(o instanceof THREE.SkinnedMesh)
            {
                if(o.material.name == "HeadMaterial") o.material.map = head_texture
                if(o.material.name == "BodyMaterial") o.material.map = body_texture
                if(o.material.name == "LegMaterial") o.material.map = legs_texture

                //console.log(o.material.name)
            }

            
        })
        


        const anims = PlayerAnimations.getAnimations()

        let animFrames = 0

        anims.map(anim => {
            animFrames += anim.frames * this._spritesDirections.length
        })


        const scene = SceneManager.getScene()
        


        let numFrames = 0

        let totalAnimFrames = 0

        for (const anim of anims)
        {
            totalAnimFrames += anim.frames

            for (let direction = 0; direction < this._spritesDirections.length; direction++)
            {
                for (let frame = 0; frame < anim.frames; frame++) {
                    numFrames++
                }
            }
        }

        const maxX = Math.ceil(numFrames / Math.ceil(Math.sqrt(numFrames)))
        
        const texture = scene.textures.createCanvas(queryItem.name, Three.size.x*maxX, Three.size.y* Math.ceil(Math.sqrt(numFrames)) )

        console.log(numFrames)


        let px = 0
        let py = 0

        let frameI = 0

        let pastFrames = 0

        

        for (const anim of anims)
        {
            for (let direction = 0; direction < this._spritesDirections.length; direction++)
            {
                for (let frame = 0; frame < anim.frames; frame++)
                {

                   

                    this.setAnimFrame(pastFrames + frame, totalAnimFrames)

                    //console.log(`setAnimFrame ${pastFrames + frame} / ${totalAnimFrames}`)

                    Three.setAngle(this._spritesDirections[direction].angle)
                    Three.animate()

                    const rect = new Phaser.Geom.Rectangle(Three.size.x * px, Three.size.y * py, Three.size.x, Three.size.y)
                    
                    texture.context.drawImage(Three.renderer.domElement, rect.x, rect.y)    

                    //console.log(frameI, maxX, '-', px, py)
                    
                        texture.add(frameI, 0, rect.x, rect.y, rect.width, rect.height)

                    frameI++;
                    px++

                    if(frameI % maxX == 0 && frameI != 0)
                    {
                        py++
                        px = 0
                    }

                    

                    await this.sleep(queryItem.options.default === true ? 0 : 0)
                }
            }

            pastFrames += anim.frames
  
        }

       

        texture.refresh()

        console.log("Completed")
        queryItem.callback()

        setTimeout(() => {
            this._running = false

            this.process()
        }, 500);
        
    }

    public static async create(name: string, options: PlayerTextureOptions)
    {
        return new Promise<void>(resolve => {
            let queryItem: QueryItem = {
                callback: resolve,
                name: name,
                options: options
            }

            this._query.push(queryItem)

            this.process()
        })
    }

    public static mixTextures(textures: string[], width: number, height: number)
    {
        const textureManager = SceneManager.getScene().textures
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