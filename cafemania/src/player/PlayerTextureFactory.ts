import SceneManager from "@cafemania/game/SceneManager";
import Three from "@cafemania/three/Three";
import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import PlayerAnimations from "./PlayerAnimations";



export default class PlayerTextureFactory
{
    private static _gltf?: GLTF
    
    private static _mixer: THREE.AnimationMixer
    private static _anim: THREE.AnimationAction
    private static _clip: THREE.AnimationClip

    private static _cachedTextures: Phaser.Textures.CanvasTexture[] = []

    public static async init()
    {
        if(this._gltf) return

        const gltf = this._gltf = await Three.loadGLTFModel('/static/cafemania/assets/char.glb')

        this._mixer = new THREE.AnimationMixer( gltf.scene );

        Three.animate()
    }

    public static initAnimation(name: string)
    {
        for (const clip of this._gltf!.animations)
        {
            if(clip.name == name)
            {
                this._clip = clip

                const anim = this._anim = this._mixer.clipAction(clip)
                anim.play()

                console.log(`Playing '${name}'`)

                return
            }
        }
    }

    public static setAnimFrame(frame: number, totalFrames: number)
    {
        this._anim.time = 0
        this._mixer.update(this._clip.duration / totalFrames * (frame))
    }

    public static async create(name: string)
    {
        await this.init()

        const head_texture = this.mixTextures(['head'], 1024, 831)
        const body_texture = this.mixTextures(['head'], 1024, 831)
        const legs_texture = this.mixTextures(['head'], 1024, 831)

        this._gltf!.scene.traverse(o => {

            if(o instanceof THREE.SkinnedMesh)
            {
                if(o.material.name == "HeadMaterial") o.material.map = head_texture
                if(o.material.name == "BodyMaterial") o.material.map = body_texture
                if(o.material.name == "LegMaterial") o.material.map = legs_texture

                console.log(o.material.name)
            }

            
        })



        const animFrames = 2
        const directions = 5

        const scene = SceneManager.getScene()
        const frames = directions * animFrames
        const texture = scene.textures.createCanvas(name, Three.size.x*frames, Three.size.y)

        const anims = PlayerAnimations.getAnimations()

        let px = 0
        let py = 0

        for (const anim of anims)
        {
            this.initAnimation(anim.name)

            for (let direction = 0; direction < directions; direction++)
            {
                for (let frame = 0; frame < anim.frames; frame++)
                {
                    this.setAnimFrame(frame, animFrames)

                    Three.setDirection(direction)
                    Three.animate()

                    const rect = new Phaser.Geom.Rectangle(Three.size.x * px, Three.size.y * py, Three.size.x, Three.size.y)
                    
                    texture.context.drawImage(Three.renderer.domElement, rect.x, rect.y)    

                    const frameName = `${anim.name}_${direction}_${frame}`

                    texture.add(frameName, 0, rect.x, rect.y, rect.width, rect.height)

                    console.log(frameName)
                }

                px++
            }

            px = 0
            py++
        }

        let n = 0

        for (let anim = 0; anim < 1; anim++)
        {
            for (let d = 0; d < directions; d++)
            {
                for (let f = 0; f < animFrames; f++)
                {
                    this.setAnimFrame(f, animFrames)

                    Three.setDirection(d)
                    Three.animate()
                    
                    texture.context.drawImage(Three.renderer.domElement, Three.size.x * n, 0)    

                    texture.add(`${anim}_${d}_${f}`, 0, Three.size.x * n, 0, Three.size.x, Three.size.y)

                    n++
                }
            }
        }

        

        texture.refresh()


        //mixedHead.destroy()    
    }

    public static mixTextures(textures: string[], width: number, height: number)
    {
        const textureManager = SceneManager.getScene().textures
        const canvasTexture = textureManager.createCanvas('tmp' + this._cachedTextures.length, width, height)

        for (const t of textures) {
            const texture = textureManager.get(t)

            canvasTexture.context.drawImage(texture.getSourceImage() as HTMLImageElement , 0, 0)
        }

        canvasTexture.refresh()

        const texture = new THREE.CanvasTexture(canvasTexture.getCanvas());
        texture.flipY = false;

        this._cachedTextures.push(canvasTexture)

        return texture
    }


}