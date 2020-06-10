import * as PIXI from 'pixi.js';

export class EditView extends PIXI.Container{
    
    dragItem:PIXI.Sprite;
    url:string = 'man.jpg';
    box:PIXI.Container;
    dragging:boolean;
    startPot:any;

    rect:PIXI.Graphics;
    left:number;
    right:number;
    top:number;
    bottom:number;
    pointer:Array<PIXI.Graphics>;
    pointerSize:number = 20;

    constructor(){
        super();

        this.rect = new PIXI.Graphics();
        this.addChild(this.rect);
        
        this.pointer = [];
        for(var i:number = 0; i < 4; i++){
            var p: PIXI.Graphics = this.makePointer();
            this.pointer.push(p);
            this.addChild(p);
        }
    }

    makePointer(){
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xff9900);
        graphics.beginFill(0x884422, 0.2);
        graphics.drawRect(0, 0, this.pointerSize, this.pointerSize);
        graphics.endFill();
        return graphics;
    }

    reset(l:number, r:number, t:number, b:number){
        this.left = l;
        this.right = r;
        this.top = t;
        this.bottom = b;
        this.update();
    }

    update(){
        var graphics = this.rect;
        graphics.clear();
        graphics.lineStyle(1, 0xff9900);
        graphics.beginFill(0x884422, 0.2);
        graphics.drawRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        graphics.endFill();

        var offset:number = this.pointerSize / 2;
        this.pointer[0].x = this.left - offset;
        this.pointer[0].y = this.top - offset;

        this.pointer[1].x = this.right - offset;
        this.pointer[1].y = this.top - offset;

        this.pointer[2].x = this.left - offset;
        this.pointer[2].y = this.bottom - offset;

        this.pointer[3].x = this.right - offset;
        this.pointer[3].y = this.bottom - offset;


    }
}