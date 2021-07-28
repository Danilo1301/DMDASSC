import SceneManager from "@cafemania/game/SceneManager";
import Three from "@cafemania/three/Three";
import * as THREE from 'three';

enum BodyPart
{
    HEAD = "Head",
    HAIR = "Hair",
    BODY = "Body",
    LEGS = "Legs"
}

export default class PlayerTextureFactory
{
    private static _bodyParts = new Map<BodyPart, THREE.Mesh>()

    public static async init()
    {
        const object = await Three.loadModel('/static/cafemania/assets/char.glb')

        object.traverse(o => {
            if (o instanceof THREE.Mesh)
            {
                if(o.name == "Head") this._bodyParts.set(BodyPart.HEAD, o)
                if(o.name == "Hair") this._bodyParts.set(BodyPart.HAIR, o)
                if(o.name == "Body") this._bodyParts.set(BodyPart.BODY, o)
                if(o.name == "Legs") this._bodyParts.set(BodyPart.LEGS, o)
            }
        })

        console.log(this._bodyParts)

        Three.animate()
    }

    public static async create()
    {
        await this.init()

        const mixedHead = this.mixTextures(['head', 'eye', 'eye2'], 1024, 831)

        const texture = new THREE.CanvasTexture(mixedHead.getCanvas());
        texture.flipY = false;

        const mat: any = this._bodyParts.get(BodyPart.HEAD)!.material

        mat.map = texture

        Three.animate()

        //mixedHead.destroy()

    
    }

    public static mixTextures(textures: string[], width: number, height: number)
    {
        const textureManager = SceneManager.getScene().textures
        const canvasTexture = textureManager.createCanvas('tmp', width, height)

        for (const t of textures) {
            const texture = textureManager.get(t)

            canvasTexture.context.drawImage(texture.getSourceImage() as HTMLImageElement , 0, 0)
        }

        canvasTexture.refresh()

        return canvasTexture
    }


}