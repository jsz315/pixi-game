import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import FrameView from '../view/FrameView';
import ScaleTooler from '../tooler/ScaleTooler';
import listener from '../listener'
import { FileTooler } from '../tooler/FileTooler';
import { createTrue } from 'typescript';
import CanvasTooler from '../tooler/CanvasTooler';

export class ClipTest extends BaseScene{

    pic:PIXI.Sprite;
    texture:PIXI.Texture;
    dragging:boolean;
    startPot:any;
    frameView:FrameView;
    scaleTooler:ScaleTooler;
    line: PIXI.Graphics;
    canvas:HTMLCanvasElement;
    png:boolean;
    times:number = 0;
    rotation:number = 0;

    imgCanvas:any;

    constructor(){
        super();
    }   

    sleep(t:number){
        return new Promise(resolve=>{
            setTimeout(() => {
                resolve();
            }, t);
        })
    }

    async init(width:number, height:number, app:PIXI.Application){
        super.init(width, height, app);

        var url = this.getQueryString("url");
        console.log("裁剪图片", url);

        var res = await FileTooler.isPng(url);
        console.log(res, 'png');
        this.png = !!res;
        var texture:any;

        if(url.startsWith("http")){
            console.log("start load");
            await this.load(url);
            console.log("over load");
            texture = this.loader.resources[url].texture;
        }
        else{
            texture = PIXI.Texture.from(url);
        }

        this.imgCanvas = await CanvasTooler.getCanvasByUrl(url);

        this.times = 0;
        while(++this.times < 30){
            await this.sleep(30);
            console.log("time" + this.times, texture.width);
            if(texture.width > 10){
                this.times = 30;
            }
        }
        this.setup(texture);

        listener.on("preStart", (v:boolean) => {
            if(v){
                this.pic.visible = false;
            }
            else{
                this.pic.visible = true;
            }
        });

        listener.on("preClip", (rect:any) => {
            var {left, top, width, height, padding, img} = rect;
            console.log(rect, "rect");
            console.log(this.frameView.rect, "this.frameView.rect");
            var {maxX, maxY, minX, minY} = this.frameView.rect;

            var scale;
            if(width > height){
                scale = img.width / width;
            }
            else{
                scale = img.height / height;
            }

            var x = (minX - left) * scale;
            var y = (minY - top) * scale;
            var w = (maxX - minX) * scale;
            var h = (maxY - minY) * scale;

            var div = FileTooler.getClipImage(img, x, y, w, h);
            // document.body.appendChild(div);
            this.imgCanvas = div;
            this.texture = PIXI.Texture.from(this.imgCanvas);
            this.pic.texture = this.texture;
            if(w > h){
                this.fitWidth();
            }
            else{
                this.fitHeight();
            }

        })

        listener.on("clipStart", (scale:number)=>{
            console.log(scale, "scale");
            this.onDraw(scale);
        })
        listener.on("transform", (key:string)=>{
            switch(key){
                case "fitWidth":
                    this.fitWidth();
                    break;
                case "fitHeight":
                    this.fitHeight();
                    break;
                case "rotateLeft":
                    this.rotateLeft();
                    break;
                case "rotateRight":
                    this.rotateRight();
                    break;
                case "turnX":
                    this.turnX();
                    break;
                case "turnY":
                    this.turnY();
                    break;
            
                default:
                    break;
                
            }
            
        })
    }

    getQueryString(name:string):any {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
    }

    fitWidth() {
        var p = this.frameView.padding;
        var w = this.texture.width;
        var h = this.texture.height;
        var s = (this.width - 2 * p) / w;
        this.pic.scale.set(s, s);
        this.pic.position.x = p;
        this.pic.position.y = this.height / 2 - (s * h) / 2;

        var l = p;
        var r = this.width - p;
        var t = w > h ? this.pic.position.y : p;
        var b = w > h ? this.height - this.pic.position.y : this.height - p;
        this.frameView.reset(l, r, t, b);
    }

    fitHeight(){
        var p = this.frameView.padding;
        var w = this.texture.width;
        var h = this.texture.height;
        var s = (this.height - 2 * p) / h;
        this.pic.scale.set(s, s);
        this.pic.position.x = this.width / 2 - (s * w) / 2;
        this.pic.position.y = p;

        var l = w > h ? p : this.pic.position.x;
        var r =  w > h ? this.width - p : this.width - this.pic.position.x;
        var t = p;
        var b = this.height - p;
        this.frameView.reset(l, r, t, b);
    }

    rotateLeft(){
        this.imgCanvas = CanvasTooler.rotateCanvas(this.imgCanvas, -90);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        if(this.texture.width > this.texture.height){
            this.fitWidth();
        }
        else{
            this.fitHeight();
        }
    }

    rotateRight(){
        this.imgCanvas = CanvasTooler.rotateCanvas(this.imgCanvas, 90);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        if(this.texture.width > this.texture.height){
            this.fitWidth();
        }
        else{
            this.fitHeight();
        }
    }

    turnX(){
        this.imgCanvas = CanvasTooler.scaleCanvas(this.imgCanvas, -1, 1);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
    }

    turnY(){
        this.imgCanvas = CanvasTooler.scaleCanvas(this.imgCanvas, 1, -1);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
    }
    
    setup(texture:PIXI.Texture){
        this.texture = texture;   
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        var w = this.texture.width;
        var h = this.texture.height;

        this.pic = new PIXI.Sprite(texture);
        console.log('pic', this.pic);

        // this.pic.anchor.set(0, 0);
        this.pic.position.set(this.width / 2 - w / 2, this.height / 2 - h / 2);
        this.container.addChild(this.pic);

        this.frameView = new FrameView(this.width,this.height);
        this.container.addChild(this.frameView);

        this.scaleTooler = new ScaleTooler(this.frameView, this.pic);
    }
    
    onDraw(scale:number){
        var {minX, maxX, minY, maxY} = this.frameView.rect;
        var x = minX - this.pic.x;
        var y = minY - this.pic.y;
        var width = maxX - minX;
        var height = maxY - minY;
        var s = this.pic.scale.x;

        console.log(this.pic, "this.pic");
        var img:any = this.texture.baseTexture.resource;

        if(!this.canvas){
            this.canvas = document.createElement('canvas');
        }
        let canvas = this.canvas;
        canvas.width = width / s * scale;
        canvas.height = height / s * scale;

        let ctx:any = canvas.getContext('2d');
        ctx.drawImage(img.source, x / s, y / s, width / s, height / s, 0, 0, canvas.width, canvas.height);
        let urlData;
        if(this.png){
            urlData = canvas.toDataURL("image/png");
        }
        else{
            urlData = canvas.toDataURL("image/jpeg", 0.8);
        }

        var blob = FileTooler.dataURLtoBlob(urlData);
        var url = urlData;
        var info = {
            originSize: {
                width: this.texture.width,
                height: this.texture.height
            },
            clipSize: {
                width: canvas.width,
                height: canvas.height
            }
        };

        listener.emit("clipEnd", url, blob, info);
    }
    
    update(){
        // if(this.pic){
        //     this.pic.rotation += 0.04;
        // }
    }

    destory(): void {
        super.destory();
    }

}