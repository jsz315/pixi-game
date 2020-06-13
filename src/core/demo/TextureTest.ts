import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class TextureTest extends BaseScene{
    box:PIXI.Container;
    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        this.box = new PIXI.Container();
        this.container.addChild(this.box);
        this.container.interactive = true;

        var btn1 = this.addText("img标签");
        btn1.interactive = true;
        btn1.anchor.set(0, 1);
        btn1.position.set(40, this.height - 40);
        btn1.on('pointerdown', this.useImage.bind(this));

        var btn2 = this.addText("base64");
        btn2.interactive = true;
        btn2.anchor.set(0.5, 1);
        btn2.position.set(this.width / 2, this.height - 40);
        btn2.on('pointerdown', this.useBase64.bind(this));

        var btn3 = this.addText("blob链接");
        btn3.interactive = true;
        btn3.anchor.set(1, 1);
        btn3.position.set(this.width - 40, this.height - 40);
        btn3.on('pointerdown', this.useBlob.bind(this));
    }

    showTexture(t:PIXI.Texture){
        var s = new PIXI.Sprite(t);
        s.anchor.set(0.5, 0.5);
        s.position.set(this.width / 2, this.height / 2);
        this.box.removeChildren();
        this.box.addChild(s);
    }

    useImage(){
        var img = document.createElement("img");
        img.src = './logo.png';
        var t = PIXI.Texture.from(img);
        this.showTexture(t);
    }

    useBase64(){
        var img = new Image();
        img.src = './logo.png';
        img.crossOrigin = '';
        img.onload = ()=>{
            var base64 = this.getBase64Image(img);
            var t = PIXI.Texture.from(base64);
            this.showTexture(t);
        }
    }

    useBlob(){
        var input:any = document.createElement("input");
        input.setAttribute("type", "file");
        input.style.position = 'fixed';
        input.style.left = '30px';
        input.style.top = '80px';
        input.addEventListener("change", (e:any)=>{
            var url = URL.createObjectURL(input.files[0]);
            var t = PIXI.Texture.from(url);
            this.showTexture(t);
            document.body.removeChild(input);
        })
        document.body.appendChild(input);
    }

    getBase64Image(img:any) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx:any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }
    
    addText(word:string):PIXI.Text{
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 30,
            fontWeight: 'bold',
            fill: ["#f0f0f0", "#999999", "#a8a8a8"],
            stroke: '#333333',
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: "#999999",
            dropShadowBlur: 3,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 4
        });
        let txt = new PIXI.Text(word, style);
        this.container.addChild(txt);
        return txt;
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