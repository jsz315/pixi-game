import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class ShapeTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';
   
    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);
        
        this.addPolygon();
        this.addRoundRect();
        this.addHole();
        this.addShapeImage();
        this.addGrid();
    }

    addShapeImage(){
        var texture = this.loader.resources[this.url].texture;
        var graphics = new PIXI.Graphics();
        graphics.beginTextureFill({
            texture: texture,
            color: 0x990011,
            alpha: 0.8
        })
        graphics.lineStyle(2, 0x990033);
        graphics.drawPolygon([
            0, 90,
            texture.width, 0,
            texture.width, texture.height - 90,
            0, texture.height
        ])
        graphics.endFill();

        graphics.scale.set(0.3, 0.3);
        graphics.position.set(200, 200);
        this.container.addChild(graphics);
    }

    addHole(){
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x337799, 0.8);
        graphics.beginFill(0x00ff00, 0.6);
        graphics.drawRect(40, 60, 200, 200);
        graphics.beginHole();
        graphics.drawCircle(100, 100, 25);
        graphics.drawRect(120, 160, 40, 30);
        graphics.endHole();
        graphics.endFill();
        this.container.addChild(graphics);
    }

    addPolygon(){
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x660044, 1);
        graphics.beginFill(0x00ff77, 0.4);
        graphics.drawPolygon([260, 60, 300, 90, 260, 120]);
        graphics.endFill();
        this.container.addChild(graphics);
    }

    addRoundRect(){
        var padding = 50;
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(3, 0x003399, 0.8);
        graphics.beginFill(0xff9900, 0.3);
        graphics.drawRoundedRect(padding, padding, this.width - 2 * padding, this.height - 2 * padding, 10);
        graphics.endFill();
        this.container.addChild(graphics);
    }

    addGrid(){
        var padding = 50;
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x999999, 0.4);
        var i;
        for(i = 0; i < this.width; i += padding){
            graphics.moveTo(i, 0);
            graphics.lineTo(i, this.height);
        }
        for(i = 0; i < this.height; i += padding){
            graphics.moveTo(0, i);
            graphics.lineTo(this.height, i);
        }
        this.container.addChild(graphics);
    }

    
    update(){
        
    }

    destory(): void {
        super.destory();
    }

}