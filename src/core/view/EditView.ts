import * as PIXI from 'pixi.js';

export class EditView extends PIXI.Container{
    
    dragItem:PIXI.Graphics;
    url:string = 'man.jpg';
    dragging:boolean;
    startPot:any;

    frame:PIXI.Graphics;
    frameMask:PIXI.Graphics;
    pointers:Array<PIXI.Graphics>;
    pointerSize:number = 40;
    pointerIndex:number;

    stageWidth:number;
    stageHeight:number;

    left:number;
    right:number;
    top:number;
    bottom:number;

    padding:number = 40;

    constructor(w:number, h:number){
        super();

        this.stageWidth = w;
        this.stageHeight = h;

        this.frameMask = new PIXI.Graphics();
        this.addChild(this.frameMask);

        this.frame = new PIXI.Graphics();
        this.frame.interactive = true;
        this.addChild(this.frame);

        // this.frame.on('pointerdown', this.onDragStart.bind(this));
        
        this.pointers = [];
        for(var i:number = 0; i < 8; i++){
            var p: PIXI.Graphics = this.makePointer();
            p.interactive = true;
            this.pointers.push(p);
            this.addChild(p);
            p.on('pointerdown', this.onDragStart.bind(this));
        }

        // this.on('pointerdown', this.onDragStart.bind(this));
        // this.on('pointerup', this.onDragEnd, this);
        // this.on('pointerupoutside', this.onDragEnd, this);
        // this.on('pointermove', this.onDragMove, this);
    }

    checkNearPointer(p:any){
        for(var i:number = 0; i < this.pointers.length; i++){
            var distance:number = this.getDistance(this.pointers[i], p);
            if(distance < this.pointerSize * 2){
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
                //左上
                if(this.pointerIndex == 0){
                    this.left = local.x;
                    this.top = local.y;
                }
                //中上
                else if(this.pointerIndex == 1){
                    this.top = local.y;
                }
                //右上
                else if(this.pointerIndex == 2){
                    this.right = local.x;
                    this.top = local.y;
                }
                //右中
                else if(this.pointerIndex == 3){
                    this.right = local.x;
                }
                //右下
                else if(this.pointerIndex == 4){
                    this.right = local.x;
                    this.bottom = local.y;
                }
                //中下
                else if(this.pointerIndex == 5){
                    this.bottom = local.y;
                }
                //左下
                else if(this.pointerIndex == 6){
                    this.left = local.x;
                    this.bottom = local.y;
                }
                //左中
                else if(this.pointerIndex == 7){
                    this.left = local.x;
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

        //左上
        this.pointers[0].x = this.left - offset;
        this.pointers[0].y = this.top - offset;

        //中上
        this.pointers[1].x = (this.left + this.right) / 2 - offset;
        this.pointers[1].y = this.top - offset;

        //右上
        this.pointers[2].x = this.right - offset;
        this.pointers[2].y = this.top - offset;

        //右中
        this.pointers[3].x = this.right - offset;
        this.pointers[3].y = (this.top + this.bottom) / 2 - offset;

        //右下
        this.pointers[4].x = this.right - offset;
        this.pointers[4].y = this.bottom - offset;

        //中下
        this.pointers[5].x = (this.right + this.left) / 2 - offset;
        this.pointers[5].y = this.bottom - offset;

        //左下
        this.pointers[6].x = this.left - offset;
        this.pointers[6].y = this.bottom - offset;

        //左中
        this.pointers[7].x = this.left - offset;
        this.pointers[7].y = (this.bottom + this.top) / 2 - offset;

        graphics = this.frameMask;
        graphics.clear();
        graphics.beginFill(0x000000, 0.8);
        graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        graphics.beginHole();
        graphics.drawRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        graphics.endHole();
        graphics.endFill();
    }
}