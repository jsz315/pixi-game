import * as PIXI from 'pixi.js';
import { BaseScene } from '../BaseScene';

export class BlendModeDemo extends BaseScene{
    
    dragItem:PIXI.Sprite;
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
            PIXI.BLEND_MODES.NORMAL,
            PIXI.BLEND_MODES.ERASE,
            PIXI.BLEND_MODES.DIFFERENCE,
            PIXI.BLEND_MODES.LIGHTEN,
            PIXI.BLEND_MODES.XOR,
            PIXI.BLEND_MODES.HARD_LIGHT,
            PIXI.BLEND_MODES.DST_ATOP,
            PIXI.BLEND_MODES.DST_IN,
            PIXI.BLEND_MODES.DST_OUT,
            PIXI.BLEND_MODES.DST_OVER,
            PIXI.BLEND_MODES.HUE,
            PIXI.BLEND_MODES.OVERLAY,
        ]
        for(var i = 0; i < list.length; i++){
            var man = this.addMan();
            man.x = Math.random() * 300;
            man.y = Math.random() * 300;
            this.box.addChild(man);
            man.blendMode = list[i];
            console.log("mode", list[i]);
            man.on('pointerdown', this.onDragStart.bind(this));
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

    onDragStart(e:any){
        console.log(e);
        var local = e.data.getLocalPosition(this.box);
        this.dragging = true;
        this.startPot = {x: local.x, y:local.y};

        var man = e.target;
        this.box.setChildIndex(man, this.box.children.length - 1);
        man.on('pointerup', this.onDragEnd, this);
        man.on('pointerupoutside', this.onDragEnd, this);
        man.on('pointermove', this.onDragMove, this);
        this.dragItem = man;
    }

    onDragMove(e:any){
        if(this.dragging){
            var local = e.data.getLocalPosition(this.box);
            var man = this.dragItem;
            man.x += local.x - this.startPot.x;
            man.y += local.y - this.startPot.y;
            this.startPot = {x: local.x, y:local.y};
        }
    }

    onDragEnd(e:any){
        this.dragging = false;
        console.log(this.container.getBounds());
        var man = this.dragItem;
        man.off('pointerup', this.onDragEnd, this);
        man.off('pointerupoutside', this.onDragEnd, this);
        man.off('pointermove', this.onDragMove, this);
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