import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { EditView } from '../view/EditView';
import { ScaleTooler } from '../tooler/ScaleTooler';
import listener from '../listener'
import { FileTooler } from '../tooler/FileTooler';
import { createTrue } from 'typescript';

export class ClipTest extends BaseScene{

    pic:PIXI.Sprite;
    texture:PIXI.Texture;
    dragging:boolean;
    startPot:any;
    editView:EditView;
    scaleTooler:ScaleTooler;
    line: PIXI.Graphics;
    canvas:HTMLCanvasElement;
    png:boolean;
    times:number = 0;
    rotation:number = 0;

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
            await this.load(url);
            texture = this.loader.resources[url].texture;
        }
        else{
            texture = PIXI.Texture.from(url);
        }

        var cs:any = await FileTooler.getUrlCanvas(url);
        // setTimeout(()=>{
        //     FileTooler.scaleCanvas(cs, 1, -1);
        // }, 3000)

        // setTimeout(()=>{
        //     FileTooler.scaleCanvas(cs, 1, -1);
        // }, 6000)

        setTimeout(async ()=>{
            cs = await FileTooler.getRotateCanvas(cs, 90);
            document.body.appendChild(cs);
        }, 3000)

        setTimeout(async ()=>{
            cs = await FileTooler.getRotateCanvas(cs, 90);
            document.body.appendChild(cs);
        }, 6000)
        

        this.times = 0;
        while(++this.times < 30){
            await this.sleep(30);
            console.log("time" + this.times, texture.width);
            if(texture.width > 10){
                this.times = 30;
            }
        }
        this.setup(texture);

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
        var p = this.editView.padding;
        var w = this.pic.texture.width;
        var h = this.pic.texture.height;
        var s = (this.width - 2 * p) / w;
        this.pic.scale.set(s, s);
        this.pic.position.x = p;
        this.pic.position.y = this.height / 2 - (s * h) / 2;

        var l = p;
        var r = this.width - p;
        var t = w > h ? this.pic.position.y : p;
        var b = w > h ? this.height - this.pic.position.y : this.height - p;
        this.editView.reset(l, r, t, b);
    }

    fitHeight(){
        var p = this.editView.padding;
        var w = this.pic.texture.width;
        var h = this.pic.texture.height;
        var s = (this.height - 2 * p) / h;
        this.pic.scale.set(s, s);
        this.pic.position.x = this.width / 2 - (s * w) / 2;
        this.pic.position.y = p;

        var l = w > h ? p : this.pic.position.x;
        var r =  w > h ? this.width - p : this.width - this.pic.position.x;
        var t = p;
        var b = this.height - p;
        this.editView.reset(l, r, t, b);
    }

    rotate(){
        var sw = this.pic.texture.width;
        var sh = this.pic.texture.height;
        var rect = new PIXI.Rectangle(0, 0, sw, sh);
        var trim = new PIXI.Rectangle(0, 0, sh, sw);

        // var trim;
        
        // if(this.rotation == 2 || this.rotation == 6){
        //     trim = new PIXI.Rectangle(0, 0, sh, sw);
        // }
        // else{
        //     trim = new PIXI.Rectangle(0, 0, sw, sh);
        // }
        var texture = new PIXI.Texture(this.pic.texture.baseTexture, rect, trim, trim, this.rotation);
        this.resetGraphics(texture, this.pic);
    }

    rotateLeft(){
        this.rotation = 2;
        // if(this.rotation > 6){
        //     this.rotation = 0;
        // }
        this.rotate();
    }

    rotateRight(){
        this.rotation = 6;
        // if(this.rotation < 0){
        //     this.rotation = 6;
        // }
        this.rotate();
    }

    turnX(){

    }

    turnY(){

    }

    test(){
        var sw = this.texture.width;
        var sh = this.texture.height;

        var rect = new PIXI.Rectangle(0, 0, sw, sh);
        var trim = new PIXI.Rectangle(0, 0, sh, sw);
        // this.texture.rotate = 2;
        // this.texture.frame = rect;

        // var offset = [90, 90];
        // var orig, trim;
        // if (offset) {
        //     orig = new PIXI.Rectangle(offset[0], offset[1], sw - offset[0], sh - offset[1]);
        //     trim = new PIXI.Rectangle(-offset[0], -offset[1], sw, sh);
        // }
        this.rotation = 2;

        var texture = new PIXI.Texture(this.texture.baseTexture, rect, trim, trim, this.rotation);
        var sp = new PIXI.Sprite(texture);
        this.container.addChild(sp);
        console.log(texture, "texture");
        console.log(sp, "sp");
        console.log(this.pic, "this.pic");

        this.resetGraphics(texture, this.pic);

    }
    
    setup(texture:PIXI.Texture){
        this.texture = texture;   
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

        this.pic = new PIXI.Sprite(texture);
        
        this.resetGraphics(texture, this.pic);
        console.log('pic', this.pic);

        this.pic.interactive = true;
        var w = texture.width;
        var h = texture.height;

        // this.pic.anchor.set(0, 0);
        this.pic.position.set(this.width / 2 - w / 2, this.height / 2 - h / 2);
        this.container.addChild(this.pic);

        this.editView = new EditView(this.width,this.height);
        // this.editView.reset(30, 720, 30, 720);
        this.container.addChild(this.editView);

        this.scaleTooler = new ScaleTooler(this.editView, this.pic, this.texture);

        // this.test();
    }

    resetGraphics(texture:PIXI.Texture, graphics: PIXI.Sprite){
        console.log(texture, "texture====")
        graphics.texture = texture;

        // graphics.clear();
        // graphics.beginTextureFill({texture: texture});
        // graphics.drawRect(0, 0, texture.width, texture.height);
        
        // graphics.endFill();
    }
    
    onDraw(scale:number){
        var {minX, maxX, minY, maxY} = this.editView.rect;
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