import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class BlendModeTest extends BaseScene{
    
    man1:PIXI.Sprite;
    man2:PIXI.Sprite;
    man3:PIXI.Sprite;
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
        this.box.addChild(rect);

        var list = [
            PIXI.BLEND_MODES.ADD,
            PIXI.BLEND_MODES.COLOR,
            PIXI.BLEND_MODES.DARKEN,
            PIXI.BLEND_MODES.ERASE,
            PIXI.BLEND_MODES.DIFFERENCE,
            PIXI.BLEND_MODES.LIGHTEN,
            PIXI.BLEND_MODES.XOR
        ]
        for(var i = 0; i < list.length; i++){
            var man = this.addMan();
            man.x = Math.random() * 300;
            man.y = Math.random() * 300;
            this.box.addChild(man);
            man.blendMode = list[i];
        }

        this.box.x = 100;
        this.box.y = 100;

        this.container.addChild(this.box);
        this.container.interactive = true;

        // this.man.on('pointerdown', this.onDragStart.bind(this));

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

    // onDragStart(e:any){
    //     console.log(e);
    //     var local = e.data.getLocalPosition(this.box);
    //     this.dragging = true;
    //     this.startPot = {x: local.x, y:local.y};

    //     this.man.on('pointerup', this.onDragEnd, this);
    //     this.man.on('pointerupoutside', this.onDragEnd, this);
    //     this.man.on('pointermove', this.onDragMove, this);
    // }

    // onDragMove(e:any){
    //     if(this.dragging){
    //         var local = e.data.getLocalPosition(this.box);
    //         this.man.x += local.x - this.startPot.x;
    //         this.man.y += local.y - this.startPot.y;
    //         this.startPot = {x: local.x, y:local.y};
    //     }
    // }

    // onDragEnd(e:any){
    //     this.dragging = false;
    //     console.log(this.container.getBounds());

    //     this.man.off('pointerup', this.onDragEnd, this);
    //     this.man.off('pointerupoutside', this.onDragEnd, this);
    //     this.man.off('pointermove', this.onDragMove, this);
    // }

    update(){
        // if(this.man){
        //     this.man.rotation += 0.04;
        // }
    }

    destory(): void {
        super.destory();
    }

}