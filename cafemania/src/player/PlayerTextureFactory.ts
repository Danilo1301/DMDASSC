import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import Three from "@cafemania/three/Three";
import { PlayerAnimation } from './PlayerAnimation';
import { MainScene } from '@cafemania/scenes/MainScene';
import { SpriteSheetOrganizer } from '@cafemania/utils/SpriteSheetOrganizer';
import { Direction } from '@cafemania/utils/Direction';

interface IPlayerTextureOptions
{
    head?: string[]
    body?: string[]
    leg?: string[]
}

interface IQueryItem
{
    callback: () => void
    name: string
    options: IPlayerTextureOptions
}

export class PlayerTextureFactory
{
    private static _gltf?: GLTF
    private static _mixer: THREE.AnimationMixer
    private static _anim: THREE.AnimationAction
    private static _clip: THREE.AnimationClip

    private static _cachedTextures: Phaser.Textures.CanvasTexture[] = []

    private static _query: IQueryItem[] = []

    private static _running: boolean = false

    private static _canvas: Phaser.Textures.CanvasTexture

    public static async init()
    {
        if(this._gltf) return

        Three.init()

        const gltf = this._gltf = await Three.loadGLTFModel('/static/cafemania/assets/player/player.glb')

        this._mixer = new THREE.AnimationMixer( gltf.scene );
        this._clip = gltf.animations[0]

        const anim = this._anim = this._mixer.clipAction(this._clip)
                
        anim.reset()
        anim.play()

        Three.animate()

        const textureManager = MainScene.Instance.game.textures
        this._canvas = textureManager.createCanvas('_PlayerTextureFactoryCanvas', Three.size.x, Three.size.y)

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

    private static angleFromDirection(direction: Direction)
    {
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

        interface IFrame
        {
            imageData: ImageData
            frameKey: string
        }

        console.log(`[PlayerTextureFactory] Generating...`)

        window['Three'] = Three

        this._canvas.clear()

        const frames: IFrame[] = []
  
        let pastFrames = 0
        let totalAnimFrames = 0

        for (const animName in PlayerAnimation.Animations)
            totalAnimFrames += PlayerAnimation.Animations[animName].frames

        for (const animName in PlayerAnimation.Animations)
        {
            const anim = PlayerAnimation.Animations[animName]
            console.log('[PlayerTextureFactory]', `Anim ${animName}`)

            for (const direction of anim.directions)
            {
                console.log('[PlayerTextureFactory]', `Direction ${direction}`)

                Three.setAngle(PlayerTextureFactory.angleFromDirection(direction) || 0)

                for (let frame = 0; frame < anim.frames; frame++)
                {
                    console.log('[PlayerTextureFactory]', `Frame ${frame} (${pastFrames + frame} / ${totalAnimFrames})`)

                    this.setAnimFrame(pastFrames + frame, totalAnimFrames)

                    Three.animate()

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

            pastFrames += anim.frames
        }

        const sheet = new SpriteSheetOrganizer()

        frames.map((frame, index) => sheet.addItem(`${index}`, frame.imageData.width, frame.imageData.height))

        sheet.organize()

        const canvas = MainScene.Instance.textures.createCanvas(queryItem.name, sheet.width, sheet.height) 
        canvas.context.fillStyle = "red"
        canvas.context.fillRect(0, 0, canvas.width, canvas.height)

        canvas.add('MAIN', 0, 0, 0, canvas.width, canvas.height)


        frames.map((frame, index) =>
        {
            const position = sheet.getItemPosition(`${index}`)

            canvas.putData(frame.imageData, position.x, position.y)
            canvas.add(frame.frameKey, 0, position.x, position.y, frame.imageData.width, frame.imageData.height)

            console.log(frame.frameKey)
        })

        canvas.refresh()

        console.log(frames)
        console.log(sheet)

        console.log(canvas.key)

        console.log("Completed")

        queryItem.callback()

        setTimeout(() => {
            this._running = false

            this.process()
        }, 0);
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
}