import * as PIXI from 'pixi.js';

export class EditView extends PIXI.Container{
    
    dragItem:PIXI.Graphics;
    url:string = 'man.jpg';
    dragging:boolean;
    startPot:any;

    frame:PIXI.Graphics;
    frameMask:PIXI.Graphics;
    pointers:Array<PIXI.Graphics>;
    pointerSize:number = 20;
    pointerIndex:number;

    stageWidth:number;
    stageHeight:number;

    left:number;
    right:number;
    top:number;
    bottom:number;

    padding:number = 30;

    constructor(w:number, h:number){
        super();

        this.stageWidth = w;
        this.stageHeight = h;

        this.frameMask = new PIXI.Graphics();
        this.addChild(this.frameMask);

        this.frame = new PIXI.Graphics();
        this.frame.interactive = true;
        this.addChild(this.frame);

        this.frame.on('pointerdown', this.onDragStart.bind(this));
        
        this.pointers = [];
        for(var i:number = 0; i < 4; i++){
            var p: PIXI.Graphics = this.makePointer();
            p.interactive = true;
            this.pointers.push(p);
            this.addChild(p);
            p.on('pointerdown', this.onDragStart.bind(this));
        }

        this.on('pointerdown', this.onDragStart.bind(this));
        this.on('pointerup', this.onDragEnd, this);
        this.on('pointerupoutside', this.onDragEnd, this);
        this.on('pointermove', this.onDragMove, this);
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
        var local = e.data.getLocalPosition(this);
        this.dragging = true;
        this.startPot = {x: local.x, y:local.y};

        var man = e.target;
        this.pointerIndex = this.checkNearPointer(local);
        console.log("this.pointerIndex", this.pointerIndex);
        
        // this.box.setChildIndex(man, this.box.children.length - 1);
        man.on('pointerup', this.onDragEnd, this);
        man.on('pointerupoutside', this.onDragEnd, this);
        man.on('pointermove', this.onDragMove, this);
        this.dragItem = man;
    }

    onDragMove(e:any){
        if(this.dragging){
            var local = e.data.getLocalPosition(this);
            var ox = local.x - this.startPot.x;
            var oy = local.y - this.startPot.y;

            if(this.dragItem == this.frame){
                this.left += ox;
                this.right += ox;
                this.top += oy;
                this.bottom += oy;
            }
            else{
                var man = this.dragItem;
                man.x += ox;
                man.y += oy;
    
                if(this.pointerIndex == 0){
                    this.left = local.x;
                    this.top = local.y;
                }
                else if(this.pointerIndex == 1){
                    this.right = local.x;
                    this.top = local.y;
                }
                else if(this.pointerIndex == 2){
                    this.left = local.x;
                    this.bottom = local.y;
                }
                else if(this.pointerIndex == 3){
                    this.right = local.x;
                    this.bottom = local.y;
                }
            }

            this.startPot = {x: local.x, y:local.y};

            this.update();
        }
    }

    onDragEnd(e:any){
        this.dragging = false;
        var man = this.dragItem;
        man.off('pointerup', this.onDragEnd, this);
        man.off('pointerupoutside', this.onDragEnd, this);
        man.off('pointermove', this.onDragMove, this);
    }

    makePointer(){
        var graphics = new PIXI.Graphics();
        // graphics.lineStyle(1, 0xffffff);
        graphics.beginFill(0x069cff, 1);
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

    constraintPosition(){
        var n:number = this.padding;

        if(this.left < n){
            this.left = n;
        }
        else if(this.left > this.right - n){
            this.left = this.right - n
        }
        if(this.right > this.stageWidth - n){
            this.right = this.stageWidth - n;
        }
        else if(this.right < this.left + n){
            this.right = this.left + n;
        }
        if(this.top < n){
            this.top = n;
        }
        else if(this.top > this.bottom - n){
            this.top = this.bottom - n;
        }
        if(this.bottom > this.stageHeight - n){
            this.bottom = this.stageHeight - n;
        }
        else if(this.bottom < this.top + n){
            this.bottom = this.top + n;
        }

    }

    update(){
        this.constraintPosition();

        var graphics = this.frame;
        graphics.clear();
        graphics.lineStyle(1, 0x069cff);
        graphics.beginFill(0xffffff, 0.03);
        graphics.drawRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        graphics.endFill();

        var offset:number = this.pointerSize / 2;
        this.pointers[0].x = this.left - offset;
        this.pointers[0].y = this.top - offset;

        this.pointers[1].x = this.right - offset;
        this.pointers[1].y = this.top - offset;

        this.pointers[2].x = this.left - offset;
        this.pointers[2].y = this.bottom - offset;

        this.pointers[3].x = this.right - offset;
        this.pointers[3].y = this.bottom - offset;

        graphics = this.frameMask;
        graphics.clear();
        graphics.beginFill(0x000000, 0.4);
        graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        graphics.beginHole();
        graphics.drawRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        graphics.endHole();
        graphics.endFill();
    }
}