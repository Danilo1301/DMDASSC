import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class ThreeModels {

    private static _models = new Map<string, GLTF>();

    public static hasLoaded(path: string) {
        return this._models.has(path);
    }

    public static async get(path: string) {
        if(!this.hasLoaded(path)) await this.load(path);

        const object = this._models.get(path)!;
        return object;
    }

    public static load(path: string) {
        const onProgress = () => console.log("onProgress")
        const onError = (error) => console.log("onError", error)

        const models = this._models;

        console.log(`[ThreeModels] Loading ${path}...`)

        return new Promise<GLTF>(resolve => {
            const loader = new GLTFLoader();
            loader.load(path, function(gltf) {
    
                models.set(path, gltf);
                resolve(gltf)
    
            }, onProgress, onError);
        })
    }
}