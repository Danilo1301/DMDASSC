import { SceneManager } from '@cafemania/sceneManager/SceneManager';
import { BaseScene } from './BaseScene';
import { GameScene } from './GameScene';
import { HudScene } from './HudScene';
import { MapGridScene } from './MapGridScene';
import { ClothingType } from '@cafemania/player/PlayerClothesFactory';
import Three from '@cafemania/three/Three';

export class MainScene extends BaseScene
{
    public static Instance: MainScene

    constructor()
    {
        super({})

        MainScene.Instance = this
    }

    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')
        this.load.image('tile1', 'tile1.png')
        this.load.image('1x1white', '1x1white.png')
        this.load.image('wallMask', 'wallMask.png')
 
        this.load.image('shoes/1', '/player/shoes/1.png')

        this.load.image('player/head', '/player/head.png')
        this.load.image('player/eye', '/player/eye.png')
        this.load.image('player/body1', '/player/body1.png')
        this.load.image('player/body2', '/player/body2.png')
        this.load.image('player/leg', '/player/leg.png')
        this.load.bitmapFont('gem', '/fonts/gem.png', '/fonts/gem.xml');
       
        this.loadTileItemInfo()
        this.loadDishes()

        this.load.audio('audio_tip', '/audio/tip.mp3');
        this.load.audio('begin_cook', '/audio/begin_cook.mp3');
        this.load.audio('dish_ready', '/audio/dish_ready.mp3');

        this.load.audio('begin_eat1', '/audio/begin_eat1.mp3');
        this.load.audio('begin_eat2', '/audio/begin_eat2.mp3');
        this.load.audio('begin_eat3', '/audio/begin_eat3.mp3');
        this.load.audio('begin_eat4', '/audio/begin_eat4.mp3');

        this.load.audio('theme_music', '/audio/theme_music.mp3');

    }

    private loadTileItemInfo()
    {
        const tileItemInfoList = this.getGame().tileItemFactory.getTileItemInfoList()

        for (const id in tileItemInfoList)
        {
            const tileItemInfo = tileItemInfoList[id]
            const texture = tileItemInfo.texture

            this.load.image(texture, `tileItem/${texture}.png`)
        }
    }

    private loadDishes()
    {
        const dishList = this.getGame().dishFactory.getDishList()

        for (const id in dishList)
        {
            const dish = dishList[id]
            const texture = dish.texture

            this.load.image(texture, `dish/${texture}.png`)
        }
    }

    public async startTest() {

       
        /*
        let maxI = PlayerTextureFactory.getTotalAnimFrames() - 1;
        let i = 0;
        let angle = 0;
        function animate() {
            i += 0.1;
            PlayerTextureFactory.animate();
            
            if(i >= maxI) i = 0;
            
            PlayerTextureFactory.setAnimationFrame(i);
            PlayerTextureFactory.setAngle(angle)
            
            angle += 1;
        }
        
        animate();
        setInterval(() => animate(), 30)

        */
        
        


    }

    public async create() {

        //const music = this.sound.add('theme_music', {loop: true});
        //music.play();

        const PlayerTextureFactory = (await import("../player/PlayerTextureFactory")).PlayerTextureFactory

        window['Three'] = Three;
        window['SceneManager'] = SceneManager;
        window['PlayerTextureFactory'] = PlayerTextureFactory;

        await PlayerTextureFactory.init('player_render_canvas');
        await PlayerTextureFactory.equipClothing(ClothingType.HAIR, 'hair1');
        await PlayerTextureFactory.setHairColor('black');
        await PlayerTextureFactory.setSkinColor('#D39A3F');

        const tag = 'PlayerSpriteTexture_'
        await PlayerTextureFactory.generatePlayerTexture(tag + 'NoTexture', {animations: ['Idle', 'Walk']});
        await PlayerTextureFactory.generatePlayerTexture(tag + 'TestClient',  {animations: ['Idle', 'Walk', 'Sit', 'Eat']});
        
        await PlayerTextureFactory.equipClothing(ClothingType.HAIR, 'hair2');
        await PlayerTextureFactory.setHairColor('black');
        await PlayerTextureFactory.setSkinColor('gray');
        await PlayerTextureFactory.generatePlayerTexture(tag + 'TestWaiter', {animations: ['Idle', 'Walk']});
        await PlayerTextureFactory.setSkinColor('white');
    
        await PlayerTextureFactory.setHairColor('brown');
        await PlayerTextureFactory.generatePlayerTexture(tag + 'TestCheff', {animations: ['Idle', 'Walk']});
       
        PlayerTextureFactory.animate()
        




        
        /*
        const doorModel = await Three.loadGLTFModel('/static/cafemania/assets/player/door.glb', true)
        doorModel.gltf.scene.position.set(0, 0.3, 0);
        Three.setAnimationFrame(doorModel, 1, 2);

        var n = 0;

        setInterval(() => {
            n += 0.01;

            Three.setAnimationFrame(doorModel, n, 2);
        }, 10)
        */
        
        /*
        const playerModel = await Three.loadGLTFModel('/static/cafemania/assets/player/player.glb', true)
        playerModel.gltf.scene.position.set(0, 10, 0);
        Three.setAnimationFrame(playerModel, 3, 3);
     
        const shoesModel = await Three.loadGLTFModel('/static/cafemania/assets/player/shoes.glb')
        const hairModel = await Three.loadGLTFModel('/static/cafemania/assets/player/hair.glb')

        const feetRBone = playerModel.gltf.scene.children[0].children[0].children[2].children[0].children[0];
        const hairBone = playerModel.gltf.scene.children[0].children[0].children[0].children[0].children[0];

        var maxI = 3;
        var i = 0;

        setInterval(() => {
            

            i++;
            if(i >= maxI) i = 0;

            Three.setAnimationFrame(playerModel, i, maxI);
        }, 200)

        /*
        const hairObj = await Three.loadGLTFModel('/static/cafemania/assets/player/hair.glb')

        window['playerObj'] = playerObj
        window['hairObj'] = hairObj

        playerObj.scene.position.set(0, 1, 0)
        hairObj.scene.position.set(0, 0, 0)

        //obj2.scene.position.set(0, 0, 0)
        //obj2.scene.children[0].position.set(0, 0, 0)

        const feetRBone = playerObj.scene.children[0].children[0].children[2].children[0].children[0];
        const hairBone = playerObj.scene.children[0].children[0].children[0].children[0].children[0];

        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        hairBone.getWorldPosition( pos );
        hairBone.getWorldQuaternion( quat );
    
        
        hairObj.scene.position.set(pos.x, pos.y, pos.z)
        hairObj.scene.quaternion.set(quat.x, quat.y, quat.z, quat.w)

     
 
        const canvas = this.textures.createCanvas('test125', Three.size.x, Three.size.y);
        setInterval(() => {
            Three.setModelToObject(shoesModel, feetRBone);
            Three.setModelToObject(hairModel, hairBone);

            Three.animate()

            canvas.context.fillStyle = "green";
            canvas.context.fillRect(0, 0, Three.size.x, Three.size.y)
            canvas.context.drawImage(Three.renderer.domElement, 0, 0);
            canvas.refresh();
        }, 10)
        //window['PlayerTextureFactory'] = PlayerTextureFactory
        const img = this.add.image(300, 300, 'test125')
        img.setScale(1)

        /*
        await this.startGameScene()

        const world = this.getGame().createWorld()
        world.createDefaultMap(15, 15)

        //world.createDefaultWaiters()

        const started = Date.now()

        const client = world.spawnPlayerClient()

        */
      
        const singlePlayer = true;

        if(singlePlayer) {
            await this.startGameScene()
    
            const world = this.getGame().createWorld()
            world.createDefaultMap(22, 22)
            world.setPlayerClientSpawnEnabled(true);
            world.createDefaultWaiters();


        } else {
            const network = this.getGame().network

            network.events.on("connected", async () => {
                
                await this.startGameScene()
    
                const world = this.getGame().createClientWorld()
                
    
                network.send("loaded")
            })
            network.connect()
        }

        

        
    }

    private async startGameScene()
    {
        SceneManager.startScene('GameScene', GameScene)
        SceneManager.startScene('HudScene', HudScene)
        SceneManager.startScene('MapGridScene', MapGridScene)

        
        this.scene.get('GameScene').scene.bringToTop()
        this.scene.get('MapGridScene').scene.bringToTop()
        this.scene.get('HudScene').scene.bringToTop()
        

        this.scene.remove('MainScene')
        console.log("[MainScene] Removed")
    }

    public update(time: number, delta: number): void
    {
        
    }
}