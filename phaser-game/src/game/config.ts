export let config: Phaser.Types.Core.GameConfig = {
    title: "Game",
    transparent: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 900,
        height: 600
    },
    parent: "game",
    backgroundColor: "#110f25",
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

