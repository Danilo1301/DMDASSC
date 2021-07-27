import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export enum ThreeDirection
{
    FRONT,
    FRONT_ISO,
    SIDE,
    BACK_ISO,
    BACK
}

export default class Three
{
    public static readonly size = {x: 150, y: 200}
    public static camera: THREE.OrthographicCamera
    public static scene: THREE.Scene
    public static renderer: THREE.WebGLRenderer
    public static object?: THREE.Group

    public static async init()
    {
        const size = this.size
        const frustumSize = 5;
        const aspect = size.x / size.y //window.innerWidth / window.innerHeight;
        const camera = this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

        camera.position.set( -200, 200, 200 );

        const scene = this.scene = new THREE.Scene();
        //sbcene.ackground = new THREE.Color( 0xFF00FF );
        camera.lookAt( scene.position );

        const renderer = this.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true, preserveDrawingBuffer: true } );
        renderer.setPixelRatio( 1 );
        renderer.setSize( size.x, size.y );

        const light = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( light );

        document.body.appendChild( this.renderer.domElement );

        //this.loadGLTF('/static/cafemania/assets/player.glb')

        //this.animate()
    }

    public static setDirection(direction: ThreeDirection)
    {
        const angles = [45]
        const object = this.object!
        object.rotation.y = Phaser.Math.DegToRad(angles[direction])
    }

    public static animate()
    {
        //requestAnimationFrame( this.animate.bind(this) );
        
        if(this.object) this.object.rotation.y += 0.01;
    
        this.scene.background = new THREE.Color( Math.random()*1000 );

        this.renderer.render( this.scene, this.camera );

        
    }

    public static async loadModel(path: string)
    {
        return new Promise<void>((resolve) => {
            const onProgress = () => console.log("onProgress")
    
            const onError = (error) => console.log("onError", error)
        
            const scene = this.scene;

            var loader = new GLTFLoader();
            loader.load(path, function(object) {
                
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

                Three.object = object.scene

                object.scene.position.y = 1

    

				scene.add( object.scene );

                resolve()
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