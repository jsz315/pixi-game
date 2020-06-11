import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { EditView } from '../view/EditView';
import { ScaleTooler } from '../tooler/ScaleTooler';
import listener from '../listener'
import { FileTooler } from '../tooler/FileTooler';

export class ClipTest extends BaseScene{

    url:string = 'hy.jpeg';
    man:PIXI.Sprite;
    dragging:boolean;
    startPot:any;
    editView:EditView;
    scaleTooler:ScaleTooler;
    line: PIXI.Graphics;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);

        this.man = new PIXI.Sprite(this.loader.resources[this.url].texture);
        this.man.interactive = true;
        // this.man.anchor.set(0.5, 0.5);
        // this.man.scale.set(0.4, 0.4);
        this.man.position.set(0, 0);
        this.container.addChild(this.man);

        this.editView = new EditView(this.width,this.height);
        this.editView.reset(30, 720, 30, 720);
        this.container.addChild(this.editView);

        this.scaleTooler = new ScaleTooler(this.editView, this.man);

        var txt1:PIXI.Text = this.makeText("截图");
        txt1.interactive = true;
        this.container.addChild(txt1);
        txt1.anchor.set(0, 1);
        txt1.x = 40;
        txt1.y = this.height - 40;
        txt1.on('pointerdown', this.onDraw.bind(this));
    }

    onDraw(){
        if(!this.line){
            this.line = new PIXI.Graphics();
        }
        var line = this.line;
        line.clear();
        line.lineStyle(4, 0x069cff);
        // line.beginFill(0xffffff, 0.03);
        var x = this.editView.left - this.man.x;
        var y = this.editView.top - this.man.y;
        var width = this.editView.right - this.editView.left;
        var height = this.editView.bottom - this.editView.top;
        var s:number = this.man.scale.x;
        console.log(s, this.man);
        line.drawRect(x / s, y / s, width / s, height / s);
        line.endFill();
        this.man.addChild(line);

        var imgw = this.man.texture.width;
        var imgh = this.man.texture.height;

        var img:any = this.man.texture.baseTexture.resource;

        let canvas = document.createElement('canvas');
        // let scale = 750 / w;
        // let cw = w * scale;
        // let ch = h * scale;
        canvas.width = width / s;
        canvas.height = height / s;

        let ctx:any = canvas.getContext('2d');
        ctx.drawImage(img.source, x / s, y / s, width / s, height / s, 0, 0, canvas.width, canvas.height);
        let urlData = canvas.toDataURL("image/jpeg", 0.9);
        // listener.emit("draw", urlData);

        var blob = FileTooler.dataURLtoBlob(urlData);
        var url = FileTooler.blobToURL(blob);
        listener.emit("draw", url);
        console.log("url", url);
    }

    makeText(word:string):PIXI.Text{
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