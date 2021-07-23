import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Three
{
    public static camera: THREE.OrthographicCamera
    public static scene: THREE.Scene
    public static renderer: THREE.WebGLRenderer
    
    public static object?: THREE.Group

    public static init()
    {
        const frustumSize = 6;
        const aspect = window.innerWidth / window.innerHeight;
        const camera = this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

        camera.position.set( -200, 200, 200 );

        const scene = this.scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xFF00FF );
        camera.lookAt( scene.position );

        const renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( 1 );
        renderer.setSize( 400, 400 );

        document.body.appendChild( this.renderer.domElement );

        this.loadGLTF('/static/cafemania/assets/player.glb')

        this.animate()
    }

    private static animate()
    {
        requestAnimationFrame( this.animate.bind(this) );
        
        //mesh.rotation.x += 0.005;
        if(this.object) this.object.rotation.y += 0.01;
    
        this.renderer.render( this.scene, this.camera );
    }

    public static loadGLTF(path: string)
    {
        const onProgress = () => {
            console.log("onProgress")
        }
    
        const onError = () => {
            console.log("onError")
        }
    
        const scene = this.scene;

        var loader = new GLTFLoader();
        loader.load(path, function(gltf) {
            const obj = Three.object = gltf.scene

            scene.add(obj);
        }, onProgress, onError);
    }
}