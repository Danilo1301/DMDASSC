import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Three
{
    public static size = new Phaser.Math.Vector2(175, 200)
    public static camera: THREE.OrthographicCamera
    public static scene: THREE.Scene
    public static renderer: THREE.WebGLRenderer
    public static object?: THREE.Group

    public static async init()
    {
        console.log("three init")

        const size = this.size
        const frustumSize = 5;
        const aspect = size.x / size.y //window.innerWidth / window.innerHeight;
        const camera = this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

        camera.position.set( -200, 200, 200 );

        const scene = this.scene = new THREE.Scene();

        //scene.background = new THREE.Color( 0xff0000 )

        camera.lookAt( scene.position );

        const renderer = this.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true, preserveDrawingBuffer: true } );
        renderer.setPixelRatio( 1 );
        renderer.setSize( size.x, size.y );

        const light = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( light );

        document.body.appendChild( this.renderer.domElement );
    }

    public static setAngle(deg: number)
    {
        this.object!.rotation.y = Phaser.Math.DegToRad(deg)
    }

    public static animate()
    {
        this.renderer.render( this.scene, this.camera );
    }

    public static async loadGLTFModel(path: string)
    {
        return new Promise<GLTF>((resolve) => {
            const onProgress = () => console.log("onProgress")
    
            const onError = (error) => console.log("onError", error)
        
            const scene = this.scene;

            console.log(this, this.scene)

            /*
            const textureLoader = new THREE.TextureLoader();

            const map1 = textureLoader.load("/static/cafemania/assets/eye.png");
            const map = textureLoader.load("/static/cafemania/assets/eye2.png");

            map.encoding = THREE.sRGBEncoding;

            map.flipY = false;

            */

            var loader = new GLTFLoader();
            loader.load(path, function(gltf) {

                const object = Three.object = gltf.scene
                object.position.y = 1


                /*
                    mixer = new THREE.AnimationMixer( object );

					const action = mixer.clipAction( object.animations[ 0 ] );
					action.play();
                */

                    /*
                object.traverse( function ( child ) {

                    if ( child.isMesh )
                    {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }

                } );
                */
        
				scene.add(object);

                resolve(gltf)
            }, onProgress, onError);
        })
    }

    public static getImageData()
    {
        const canvas = Three.renderer.domElement
        const gl = Three.renderer.getContext()

        const pixelBuffer = new Uint8Array(canvas.width * canvas.height * 4);   

        console.log(gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer))

        return pixelBuffer
    }
}