export class WorldText
{
    constructor(scene: Phaser.Scene, text: string, position: Phaser.Math.Vector2, color?: string)
    {
        const textObj = scene.add.text(position.x, position.y, text, {color: color || "black", fontStyle: "bold", fontSize: '30px'})
        textObj.setDepth(10000)

        let distanceMoved = 0

        const listener = (time: number, delta: number) =>
        {
            const add = (delta * 0.05)

            if((distanceMoved += add) >= 100)
            {
                textObj.destroy()

                scene.events.removeListener('update', listener)

                return
            }
            
            textObj.setPosition(
                textObj.x,
                textObj.y - (delta * 0.05)
            )
            
        }

        scene.events.on('update', listener)
    
    }
}