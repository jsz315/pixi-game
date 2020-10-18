import * as PIXI from 'pixi.js';
import FrameView from '../view/FrameView';

export default class ScaleTooler{

    frameView:FrameView;
    dragging:boolean;
    startPot:any;
    distance:number;
    center:any;
    points:any[] = [];
    target:PIXI.Sprite;
    inFrame:Boolean;

    constructor(frameView:FrameView, target:PIXI.Sprite){
        this.frameView = frameView;
        this.target = target;

        this.frameView.interactive = true;
        this.frameView.on('pointerdown', this.onDragStart.bind(this));
        this.frameView.on('pointerup', this.onDragEnd, this);
        this.frameView.on('pointerupoutside', this.onDragEnd, this);
        this.frameView.on('pointermove', this.onDragMove, this);
    }


    onDragStart(e:any){
        var local = e.data.getLocalPosition(this.frameView);
        this.dragging = true;
        this.startPot = local;

        this.inFrame = this.frameView.hitFrame(e);
        this.points.push({
            data: e.data.getLocalPosition(this.frameView),
            global: e.data.global,
            id: e.data.identifier
        });

        if(this.points.length == 2){
            this.center = this.getCenter(this.points[0].data, this.points[1].data);
        }
    }

    onDragMove(e:any){
        if(!this.dragging) return;
        if(this.points.length == 2){
            var size = this.getDistance(this.points[0].global, this.points[1].global);
            if(this.distance){
                var width = this.target.width;
                var height = this.target.height;
                var scale = this.target.scale.x;
                if(size > this.distance){
                    scale *= 1.01;
                }
                else{
                    scale *= 0.99;
                }

                if(scale < 0.1){
                    scale = 0.1;
                }
                else if(scale > 2.4){
                    scale = 2.4;
                }
                this.target.scale.set(scale, scale);
                var ox = this.target.width - width;
                var oy = this.target.height - height;
                this.target.x -= ox * this.center.x / this.target.texture.width;
                this.target.y -= oy * this.center.y / this.target.texture.height;
            }
            else{
                this.distance = size;
            }
        }
        else{
            var local = e.data.getLocalPosition(this.frameView);

            if(this.inFrame){
                this.frameView.moveFrame(local.x - this.startPot.x, local.y - this.startPot.y);
            }
            else{
                this.target.x += local.x - this.startPot.x;
                this.target.y += local.y - this.startPot.y;
                console.log(this.target.x, "x")
            }
            this.startPot = local;
        }
    }

    onDragEnd(e:any){
        this.points = this.points.filter(item => item.id != e.data.identifier);
        if(this.points.length != 2){
            this.distance = 0;
            this.dragging = false;
            this.center = null;
        }
    }

    getDistance(a:any, b:any){
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    getCenter(a:any, b:any){
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }
}