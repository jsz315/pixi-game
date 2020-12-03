import * as PIXI from 'pixi.js';

/**
 * 四边框和拖动控制点视图
 */
export default class FrameView extends PIXI.Container{
    
    dragItem:PIXI.Graphics;
    dragging:boolean;
    startPot:any;

    frame:PIXI.Graphics;
    frameMask:PIXI.Graphics;
    pointers:Array<PIXI.Graphics>;
    pointerSize:number = 40;
    pointerIndex:number;

    stageWidth:number;
    stageHeight:number;

    clipWidth:number;
    clipHeight:number;

    padding:number = 40;
    rect:PIXI.Bounds;

    constructor(w:number, h:number){
        super();

        this.stageWidth = w;
        this.stageHeight = h;

        this.rect = new PIXI.Bounds();

        this.frameMask = new PIXI.Graphics();
        this.addChild(this.frameMask);

        this.frame = new PIXI.Graphics();
        this.frame.interactive = true;
        this.addChild(this.frame);
        
        this.pointers = [];
        for(var i:number = 0; i < 8; i++){
            var p: PIXI.Graphics = this.makePointer();
            p.interactive = true;
            this.pointers.push(p);
            this.addChild(p);
            p.on('pointerdown', this.onDragStart.bind(this));
        }

        this.reset(this.padding, w - this.padding, this.padding, h - this.padding);
    }

    init(horizontal:boolean){
        var w = this.stageWidth;
        var h = this.stageHeight;
        var size = (w - 2 * this.padding) / 2.4;
        if(horizontal){
            this.reset(this.padding, w - this.padding, size, h - size);
        }
        else{
            this.reset(size, w - size, this.padding, h - this.padding);
        }
    }

    checkNearPointer(p:any){
        for(var i:number = 0; i < this.pointers.length; i++){
            var distance:number = this.getDistance(this.pointers[i], p);
            if(distance < this.pointerSize){
                return i;
            }
        }
        return -1;
    }

    getDistance(a:any, b:any){
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    onDragStart(e:any){
        console.log(e);
        e.stopPropagation();
        var local = e.data.getLocalPosition(this);
        this.dragging = true;
        this.startPot = {x: local.x, y:local.y};

        var item = e.target;
        this.pointerIndex = this.checkNearPointer(local);
        console.log("this.pointerIndex", this.pointerIndex);
        
        // this.box.setChildIndex(item, this.box.children.length - 1);
        item.on('pointerup', this.onDragEnd, this);
        item.on('pointerupoutside', this.onDragEnd, this);
        item.on('pointermove', this.onDragMove, this);
        this.dragItem = item;
    }

    hitFrame(e:any){
        var local = e.data.getLocalPosition(this);
        if(local.x > this.rect.minX && local.x < this.rect.maxX){
            if(local.y > this.rect.minY && local.y < this.rect.maxY){
                return true;
            }
        }
        return false;
    }

    moveFrame(x:number, y:number){
        if(this.rect.minX + x < this.padding){
            console.log("over left");
        }
        else{
            if(this.rect.maxX + x > this.stageWidth - this.padding){
                console.log("over right");
            }
            else{
                this.rect.minX += x;
                this.rect.maxX += x;
            }
        }

        if(this.rect.minY + y < this.padding){
            console.log("over top");
        }
        else{
            if(this.rect.maxY + y > this.stageHeight - this.padding){
                console.log("over bottom");
            }
            else{
                this.rect.minY += y;
                this.rect.maxY += y;
            }
        }

        this.update();
    }

    onDragMove(e:any){
        if(this.dragging){
            var local = e.data.getLocalPosition(this);

            //左上
            if(this.pointerIndex == 0){
                this.rect.minX = local.x;
                this.rect.minY = local.y;
                console.log("左上");
            }
            //中上
            else if(this.pointerIndex == 1){
                this.rect.minY = local.y;
                console.log("中上");
            }
            //右上
            else if(this.pointerIndex == 2){
                this.rect.maxX = local.x;
                this.rect.minY = local.y;
                console.log("右上");
            }
            //右中
            else if(this.pointerIndex == 3){
                this.rect.maxX = local.x;
                console.log("右中");
            }
            //右下
            else if(this.pointerIndex == 4){
                this.rect.maxX = local.x;
                this.rect.maxY = local.y;
                console.log("右下");
            }
            //中下
            else if(this.pointerIndex == 5){
                this.rect.maxY = local.y;
                console.log("中下");
            }
            //左下
            else if(this.pointerIndex == 6){
                this.rect.minX = local.x;
                this.rect.maxY = local.y;
                console.log("左下");
            }
            //左中
            else if(this.pointerIndex == 7){
                this.rect.minX = local.x;
                console.log("左中");
            }


            if(this.rect.minX < this.padding){
                this.rect.minX = this.padding;
            }
            if(this.rect.maxX > this.stageWidth - this.padding){
                this.rect.maxX = this.stageWidth - this.padding;
            }
            if(this.rect.minY < this.padding){
                this.rect.minY = this.padding;
            }
            if(this.rect.maxY > this.stageHeight - this.padding){
                this.rect.maxY = this.stageHeight - this.padding;
            }

            this.clipWidth = this.rect.maxX - this.rect.minX;
            this.clipHeight = this.rect.maxY - this.rect.minY;
            
            this.emit("size", {width: this.clipWidth, height: this.clipHeight});

            this.startPot = {x: local.x, y:local.y};
            this.update();
        }
    }

    onDragEnd(e:any){
        this.dragging = false;
        var item = this.dragItem;
        item.off('pointerup', this.onDragEnd, this);
        item.off('pointerupoutside', this.onDragEnd, this);
        item.off('pointermove', this.onDragMove, this);
        console.log(this.stageWidth, this.stageHeight);
    }

    makePointer(){
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x069cff, 1);
        graphics.drawRect(0, 0, this.pointerSize, this.pointerSize);
        graphics.endFill();
        return graphics;
    }

    reset(l:number, r:number, t:number, b:number){
        this.rect.minX = l;
        this.rect.maxX = r;
        this.rect.minY = t;
        this.rect.maxY = b;

        this.clipWidth = this.rect.maxX - this.rect.minX;
        this.clipHeight = this.rect.maxY - this.rect.minY;

        this.update();
    }

    update(){

        var left = this.rect.minX;
        var top = this.rect.minY;
        var right = this.rect.maxX;
        var bottom = this.rect.maxY;

        var graphics = this.frame;
        graphics.clear();
        graphics.lineStyle(1, 0x069cff);
        //透明层，用来交互
        graphics.beginFill(0xffffff, 0.04);
        graphics.drawRect(left, top, right - left, bottom - top);
        graphics.endFill();

        var offset:number = this.pointerSize / 2;

        //左上
        this.pointers[0].x = left - offset;
        this.pointers[0].y = top - offset;

        //中上
        this.pointers[1].x = (left + right) / 2 - offset;
        this.pointers[1].y = top - offset;

        //右上
        this.pointers[2].x = right - offset;
        this.pointers[2].y = top - offset;

        //右中
        this.pointers[3].x = right - offset;
        this.pointers[3].y = (top + bottom) / 2 - offset;

        //右下
        this.pointers[4].x = right - offset;
        this.pointers[4].y = bottom - offset;

        //中下
        this.pointers[5].x = (right + left) / 2 - offset;
        this.pointers[5].y = bottom - offset;

        //左下
        this.pointers[6].x = left - offset;
        this.pointers[6].y = bottom - offset;

        //左中
        this.pointers[7].x = left - offset;
        this.pointers[7].y = (bottom + top) / 2 - offset;

        graphics = this.frameMask;
        graphics.clear();
        graphics.beginFill(0x000000, 0.8);
        graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        graphics.beginHole();
        graphics.drawRect(left, top, right - left, bottom - top);
        graphics.endHole();
        graphics.endFill();
    }
}