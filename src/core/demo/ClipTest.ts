import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { EditView } from '../view/EditView';
import { ScaleTooler } from '../tooler/ScaleTooler';
import listener from '../listener'
import { FileTooler } from '../tooler/FileTooler';

export class ClipTest extends BaseScene{

    man:PIXI.Sprite;
    dragging:boolean;
    startPot:any;
    editView:EditView;
    scaleTooler:ScaleTooler;
    line: PIXI.Graphics;
    canvas:HTMLCanvasElement;
    png:boolean;
    times:number = 0;

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

        this.png = false;
        var texture:any;

        if(url.startsWith("http")){
            await this.load(url);
            texture = this.loader.resources[url].texture;
        }
        else{
            texture = PIXI.Texture.from(url);
        }

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
            this.onDraw(scale);
        })
        listener.on("fitWidth", ()=>{
            this.fitWidth();
        })
        listener.on("fitHeight", ()=>{
            this.fitHeight();
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
        var w = this.man.texture.width;
        var h = this.man.texture.height;
        var s = (this.width - 2 * p) / w;
        this.man.scale.set(s, s);
        this.man.position.x = p;
        this.man.position.y = this.height / 2 - (s * h) / 2;

        var l = p;
        var r = this.width - p;
        var t = w > h ? this.man.position.y : p;
        var b = w > h ? this.height - this.man.position.y : this.height - p;
        this.editView.reset(l, r, t, b);
    }

    fitHeight(){
        var p = this.editView.padding;
        var w = this.man.texture.width;
        var h = this.man.texture.height;
        var s = (this.height - 2 * p) / h;
        this.man.scale.set(s, s);
        this.man.position.x = this.width / 2 - (s * w) / 2;
        this.man.position.y = p;

        var l = w > h ? p : this.man.position.x;
        var r =  w > h ? this.width - p : this.width - this.man.position.x;
        var t = p;
        var b = this.height - p;
        this.editView.reset(l, r, t, b);
    }
    
    setup(texture:PIXI.Texture){
        this.man = new PIXI.Sprite(texture);
        this.man.interactive = true;
        var w = texture.width;
        var h = texture.height;

        this.man.anchor.set(0, 0);
        this.man.position.set(this.width / 2 - w / 2, this.height / 2 - h / 2);
        this.container.addChild(this.man);

        this.editView = new EditView(this.width,this.height);
        this.editView.reset(30, 720, 30, 720);
        this.container.addChild(this.editView);

        this.scaleTooler = new ScaleTooler(this.editView, this.man);
    }

    onDraw(scale:number){

        var x = this.editView.left - this.man.x;
        var y = this.editView.top - this.man.y;
        var width = this.editView.right - this.editView.left;
        var height = this.editView.bottom - this.editView.top;
        var s = this.man.scale.x;

        var img:any = this.man.texture.baseTexture.resource;

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
            urlData = canvas.toDataURL("image/jpeg", 0.9);
        }

        var blob = FileTooler.dataURLtoBlob(urlData);
        var url = urlData;
        var info = {
            originSize: {
                width: this.man.texture.width,
                height: this.man.texture.height
            },
            clipSize: {
                width: canvas.width,
                height: canvas.height
            }
        };

        listener.emit("clipEnd", url, blob, info);
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