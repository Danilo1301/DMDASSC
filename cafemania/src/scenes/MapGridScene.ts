
import { Grid } from '@cafemania/grid/Grid';
import { BaseScene } from '@cafemania/scenes/BaseScene';

export class MapGridScene extends BaseScene
{
    public static grid?: Grid

    public preload(): void
    {
    }

    public create(): void
    {
        //this.cameras.main.setBackgroundColor(0x000)   

  

        //this.cameras.main.setSize(200, 200)
        //this.cameras.main.setPosition(5, 30)
        //this.cameras.main.setBackgroundColor(0x000)    
        //this.cameras.main.setZoom(1)
        this.cameras.main.setOrigin(0)
        this.cameras.main.setScroll(-20, 0)
        ///new MoveScene(this)

        

      

        
        //this.createGrid()

        this.drawGrid()
    }

    public update(time: number, delta: number): void
    {
    }


    private drawGrid()
    {
        
        const graphics = this.add.graphics()

        




        setInterval(() => {
   
            
            graphics.clear()

            const grid = MapGridScene.grid

            graphics.fillStyle(0x000)
            graphics.fillRect(-15, 30, 150, 150)

            if(!grid) return

            grid.getCells().map(cell => {

                graphics.fillStyle(0xffffff, 1)
    
                for (const item of cell.ocuppiedByItems)
                {
                    if(item.color == 0) continue

                    graphics.fillStyle(item.color, 0.7)
                }

                
                if(cell.item != undefined)
                {
                    //graphics.fillStyle(0x000)
                }
    
                const s = 5

                graphics.fillRect(cell.x * (s + 1), 40 + (cell.y * (s + 1)), s, s)
            })
        }, 200)
    }
}