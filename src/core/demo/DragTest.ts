import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class DragTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';
    box:PIXI.Container;
    dragging:boolean;
    startPot:any;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);

        this.box = this.addBox();
        var rect = this.addRect();
        this.man = this.addMan();

        this.man.x = 100;
        this.man.y = 100;

        this.box.addChild(rect);
        this.box.addChild(this.man);

        this.box.x = 100;
        this.box.y = 100;

        this.container.addChild(this.box);
        this.container.interactive = true;

        this.man.on('pointerdown', this.onDragStart.bind(this));
    }

    addMan():PIXI.Sprite{
        var man = new PIXI.Sprite(this.loader.resources[this.url].texture);
        man.interactive = true;
        man.scale.set(0.4, 0.4);
        return man;
    }

    addBox():PIXI.Container{
        var box = new PIXI.Container();
        this.container.addChild(box);
        return box;
    }

    addRect():PIXI.Graphics{
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xff9900);
        graphics.beginFill(0x884422);
        graphics.drawRect(0, 0, 500, 400);
        graphics.endFill();
        return graphics;
    }

    onDragStart(e:any){
        console.log(e);
        var local = e.data.getLocalPosition(this.box);
        this.dragging = true;
        this.startPot = {x: local.x, y:local.y};

        this.man.on('pointerup', this.onDragEnd, this);
        this.man.on('pointerupoutside', this.onDragEnd, this);
        this.man.on('pointermove', this.onDragMove, this);
    }

    onDragMove(e:any){
        if(this.dragging){
            var local = e.data.getLocalPosition(this.box);
            this.man.x += local.x - this.startPot.x;
            this.man.y += local.y - this.startPot.y;
            this.startPot = {x: local.x, y:local.y};
        }
    }

    onDragEnd(e:any){
        this.dragging = false;
        console.log(this.container.getBounds());

        this.man.off('pointerup', this.onDragEnd, this);
        this.man.off('pointerupoutside', this.onDragEnd, this);
        this.man.off('pointermove', this.onDragMove, this);
    }

    update(){
        // if(this.man){
        //     this.man.rotation += 0.04;
        // }
    }

    destory(): void {
        super.destory();
    }

}