export let config: Phaser.Types.Core.GameConfig = {
    title: "Game",
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#110f25",
    physics: {
        default: 'matter',
        matter: {
            debug: {
                showBounds: false,
                showBody: true,
                showAxes: true,
                showPositions: true,
                showVelocity: true,
                showCollisions: true,
                showAngleIndicator: true
            },
            gravity: {
                x: 0,
                y: 0
            },
        }
    },
    scene: []
}

