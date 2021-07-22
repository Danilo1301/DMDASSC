import "phaser";
import GameClient from "@cafemania/game/GameClient"
import Three from "./three/Three";

function main(): void
{
    document.body.style.margin = "0px"
    var game = window["game"] = new GameClient()
    game.start()

    Three.init()

    //init();
    //animate();
}

window.onload = main.bind(this)

/*
import * as THREE from 'three';

console.log(THREE)

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Three from "./three/Three";


let camera, scene, renderer;
let playerObj;

function init() {
    const frustumSize = 6;
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

    camera.position.set( -200, 200, 200 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFF00FF );
    camera.lookAt( scene.position );

    
    const texture = new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif' );

    const geometry = new THREE.BoxGeometry( 200, 200, 200 );
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    

    //--
    const onProgress = () => {
        console.log("onProgress")
    }

    const onError = () => {
        console.log("onError")
    }

    var loader = new GLTFLoader();
    loader.load('/static/cafemania/assets/player.glb', function(gltf) {
        playerObj = gltf.scene;

        scene.add(gltf.scene);
    }, onProgress, onError);

 

    
    let mtlLoader = new MTLLoader();
    mtlLoader.setPath('/static/cafemania/assets/');


    mtlLoader.load('player.mtl', function(materials) {
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/static/cafemania/assets/');
        
        objLoader.load('player.obj', function(object) {
            
            scene.add(object);

        }, onProgress, onError);
    });
    
    //--

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( 1 );
    renderer.setSize( 400, 400 );
    document.body.appendChild( renderer.domElement );
}

function onWindowResize() {


    //camera.updateProjectionMatrix();

    //renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    //mesh.rotation.x += 0.005;
    if(playerObj) playerObj.rotation.y += 0.01;

    renderer.render( scene, camera );

}
*/