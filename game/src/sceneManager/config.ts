export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    transparent: false,
    backgroundColor: 0x000,
    roundPixels: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 900,
        height: 600
    },
    physics: {
        default: 'matter',
        matter: {
            debug: {
                showBounds: false,
                showBody: true, //true
                showAxes: false,
                showPositions: false,
                showVelocity: true, //true
                showCollisions: false,
                showAngleIndicator: true //true
            },
            gravity: {
                x: 0,
                y: 0
            }
        }
    },  
    scene: {}
}