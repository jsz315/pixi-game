import * as PIXI from 'pixi.js';
import { BaseScene } from '../BaseScene';
import listener from '../listener'
import CanvasTooler from '../tooler/CanvasTooler';
import CommonTooler from '../tooler/CommonTooler';
import ConvertTooler from '../tooler/ConvertTooler';
import ScaleView from '../view/ScaleView';

export class ImageCliper extends BaseScene{

    pic:PIXI.Sprite;
    texture:PIXI.Texture;
    dragging:boolean;
    startPot:any;
    // frameView:FrameView;
    // scaleTooler:ScaleTooler;
    scaleView:ScaleView;
    line: PIXI.Graphics;
    canvas:HTMLCanvasElement;
    png:boolean;
    times:number = 0;
    rotation:number = 0;

    imgCanvas:any;

    constructor(){
        super();
    }   

    async init(width:number, height:number, app:PIXI.Application){
        super.init(width, height, app);

        var url = CommonTooler.getQueryString("url");
        console.log("image url: ", url);

        var res = await CommonTooler.checkPng(url);
        this.png = !!res;

        var texture:any;

        if(url.startsWith("http")){
            await this.load(url);
            texture = this.loader.resources[url].texture;
        }
        else{
            texture = PIXI.Texture.from(url);
        }
       
        this.imgCanvas = await CanvasTooler.getCanvasByUrl(url);
        await CommonTooler.checkTexture(texture);

        this.setup(texture);
        this.addListeners();
    }

    addListeners(){
        //长图使用dom截取完成
        listener.on("endDom", (rect:any) => {
            this.pic.visible = true;

            if(!rect){
                return;
            }

            var {left, top, width, height, img} = rect;
            var {maxX, maxY, minX, minY} = this.scaleView.frameView.rect;

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

            var div = CanvasTooler.getClipCanvas(img, x, y, w, h);
            // document.body.appendChild(div);
            this.imgCanvas = div;
            listener.emit("clipSize", w, h);
            this.texture = PIXI.Texture.from(this.imgCanvas);
            this.pic.texture = this.texture;
            if(w > h){
                this.fitWidth();
            }
            else{
                this.fitHeight();
            }

        })

        //长图使用dom初始化
        listener.on("startDom", (horizontal:boolean, callback:Function) => {
            this.pic.visible = false;

            this.scaleView.frameView.init(horizontal);
            var rect = this.scaleView.frameView.rect;

            callback({
                left: rect.minX,
                right: rect.maxX,
                top: rect.minY,
                bottom: rect.maxY
            })
        })

        //裁剪预览
        listener.on("clipPreview", (scale:number)=>{
            console.log(scale, "scale");
            this.onDraw(scale);
        })

        //图片变换
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
   

    fitWidth() {
        var p = this.scaleView.frameView.padding;
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
        this.scaleView.frameView.reset(l, r, t, b);

        listener.emit("clipSize", w, (b - t) * s);
    }

    fitHeight(){
        var p = this.scaleView.frameView.padding;
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
        this.scaleView.frameView.reset(l, r, t, b);

        listener.emit("clipSize", (r - l) / s, h);
    }

    rotateLeft(){
        this.imgCanvas = CanvasTooler.getRotateCanvas(this.imgCanvas, -90);
        
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        listener.emit("clipSize", this.texture.width, this.texture.height);
        if(this.texture.width > this.texture.height){
            this.fitWidth();
        }
        else{
            this.fitHeight();
        }
    }

    rotateRight(){
        this.imgCanvas = CanvasTooler.getRotateCanvas(this.imgCanvas, 90);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        listener.emit("clipSize", this.texture.width, this.texture.height);
        if(this.texture.width > this.texture.height){
            this.fitWidth();
        }
        else{
            this.fitHeight();
        }
    }

    turnX(){
        this.imgCanvas = CanvasTooler.getScaleCanvas(this.imgCanvas, -1, 1);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        listener.emit("clipSize", this.texture.width, this.texture.height);
    }

    turnY(){
        this.imgCanvas = CanvasTooler.getScaleCanvas(this.imgCanvas, 1, -1);
        this.texture = PIXI.Texture.from(this.imgCanvas);
        this.pic.texture = this.texture;
        listener.emit("clipSize", this.texture.width, this.texture.height);
    }
    
    setup(texture:PIXI.Texture){
        this.texture = texture;   
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        var w = this.texture.width;
        var h = this.texture.height;

        this.pic = new PIXI.Sprite(texture);
        listener.emit("initSize", w, h);

        this.pic.position.set(this.width / 2 - w / 2, this.height / 2 - h / 2);
        this.container.addChild(this.pic);

        this.scaleView = new ScaleView(this.width, this.height, this.pic);
        this.container.addChild(this.scaleView);

        this.scaleView.on("move", (data:any) => {
            listener.emit("move", data);
        })

        this.scaleView.frameView.on("size", (data:any) => {
            //pixi截图模式
            if(this.pic.visible){
                var {x, y} = this.pic.scale;
                listener.emit("clipSize", data.width / x, data.height / y);
            }
            //dom截图模式
            else{
                listener.emit("domSize", data.width, data.height);
            }
            
        })
    }
    
    onDraw(scale:number){
        var {minX, maxX, minY, maxY} = this.scaleView.frameView.rect;
        var x = minX - this.pic.x;
        var y = minY - this.pic.y;
        var width = maxX - minX;
        var height = maxY - minY;
        var s = this.pic.scale.x;

        var img:any = this.texture.baseTexture.resource;

        if(!this.canvas){
            this.canvas = document.createElement('canvas');
        }
        let canvas = this.canvas;
        canvas.width = Math.floor(width / s * scale);
        canvas.height = Math.floor(height / s * scale);

        let ctx:any = canvas.getContext('2d');
        ctx.drawImage(img.source, x / s, y / s, width / s, height / s, 0, 0, canvas.width, canvas.height);
        let urlData;
        if(this.png){
            urlData = canvas.toDataURL("image/png");
        }
        else{
            urlData = canvas.toDataURL("image/jpeg", 0.8);
        }

        var blob = ConvertTooler.dataURLtoBlob(urlData);
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