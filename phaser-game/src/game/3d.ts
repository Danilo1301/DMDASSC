import { enable3d, Canvas, Scene3D, ExtendedObject3D } from '@enable3d/phaser-extension'

class MainScene extends Scene3D {
    car?: ExtendedObject3D
  
    init() {
      this.accessThirdDimension({ gravity: { x: 0, y: -20, z: 0 } })
    }
  
    create() {
      this.third.warpSpeed()
  
  
      //this.third.physics.add.box({ x: -2, y: 0, width: 0.32, height: 1, depth: 0.32, mass: 0 })
      this.car = this.third.add.box({ x: 0, y: 5 }, { phong: {color: 0x21572f}})
  
  
    
      //var plane = this.third.add.plane({x: 0, y: 1, z: 0, width: 0.32, height: 0.32 }, { phong: {color: 0x21572f}})

      
    }
  
    update(time: number, delta: number) {
        this.car?.rotateY(0.01)
        
      this.third.camera.position.set(0, 10, 3)
      this.third.camera.lookAt(0, 0, 0)
    }
  }



  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 400
    },
    scene: [MainScene]
}

enable3d(() => {

    var game = new Phaser.Game(config)
    
    console.log("3d")

    return game
    
}).withPhysics('/static/phaser/ammo')