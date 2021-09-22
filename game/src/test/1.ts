import { Input } from "@game/input/Input";

export class GameScene extends Phaser.Scene {

    public graphics!: Phaser.GameObjects.Graphics; 

    public curves: RoadCurve[] = [];
    
    create() {
        console.log(`[GameScene] Create`)

        Input.setup(this);

        this.cameras.main.setBackgroundColor(0x777777);

        this.graphics = this.add.graphics();

        const start = new Phaser.Math.Vector2(50, 50)

        const startPoint = new Phaser.Math.Vector2(start.x, start.y);
        const controlPoint1 = new Phaser.Math.Vector2(start.x + 100, start.y);
        const endPoint = new Phaser.Math.Vector2(start.x + 100, start.y + 100);

        

        const roadCurve = new RoadCurve(startPoint, endPoint, controlPoint1);
        this.curves.push(roadCurve);

    }

    update(time: number, delta: number) {
        this.graphics.clear();
        for (const roadCurve of this.curves) {
            roadCurve.draw(this.graphics);
        }

    }
}

class RoadCurve {
    public startPoint: Phaser.Math.Vector2;
    public endPoint: Phaser.Math.Vector2;
    public controlPoint: Phaser.Math.Vector2;
    public curve: Phaser.Curves.QuadraticBezier;

    constructor(startPoint: Phaser.Math.Vector2, endPoint: Phaser.Math.Vector2, controlPoint: Phaser.Math.Vector2) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.controlPoint = controlPoint;

        this.curve = new Phaser.Curves.QuadraticBezier(startPoint, controlPoint, endPoint);
    }

    public draw(graphics: Phaser.GameObjects.Graphics) {
        const curve = this.curve;

        graphics.lineStyle(3, 0x3D23FF, 1);
        curve.draw(graphics);

        const vec = curve.getPoint(0.5);

        graphics.fillStyle(0x1AB712, 1);
        graphics.fillCircle(this.startPoint.x, this.startPoint.y, 5);

        graphics.fillStyle(0xFFFFFF, 0.5);
        graphics.fillCircle(this.controlPoint.x, this.controlPoint.y, 5);

        graphics.fillStyle(0xD62F42, 1);
        graphics.fillCircle(this.endPoint.x, this.endPoint.y, 5);

    }
}