import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class TextTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';
    txt:PIXI.Text;
   
    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        this.addLine();
        this.addText1();
        this.addText2();
        this.addText3();
        this.addText4();
        this.addText5();
        this.addText6();
    }

    addLine(){
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x999999, 0.3);
        graphics.moveTo(0, this.height / 3);
        graphics.lineTo(this.width, this.height / 3);
        graphics.moveTo(this.width / 2, 0);
        graphics.lineTo(this.width / 2, this.height);
        graphics.drawRect(30, 30, this.width - 60, this.height - 60);
        this.container.addChild(graphics);
    }

    addText1(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#998800",
        });
        let txt = new PIXI.Text("左上（0,0）", style);
        txt.x = 30;
        txt.y = 30;
        this.container.addChild(txt);
    }

    addText2(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#998800",
        });
        let txt = new PIXI.Text("右上（1,0）", style);
        txt.x = this.width - 30;
        txt.y = 30;
        txt.anchor.set(1, 0);
        this.container.addChild(txt);
    }

    addText3(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#998800",
        });
        let txt = new PIXI.Text("左下（0,1）", style);
        txt.x = 30;
        txt.y = this.height - 30;
        txt.anchor.set(0, 1);
        this.container.addChild(txt);
    }

    addText4(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#998800",
        });
        let txt = new PIXI.Text("右下（1,1）", style);
        txt.x = this.width - 30;
        txt.y = this.height - 30;
        txt.anchor.set(1, 1);
        this.container.addChild(txt);
    }

    addText5(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });
        let txt = new PIXI.Text("居中对齐", style);
        txt.x = this.width / 2;
        txt.y = this.height / 3;
        txt.anchor.set(0.5, 0.5);
        this.container.addChild(txt);

        this.txt = txt;
    }

    addText6(){
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
            dropShadowDistance: 4,
            wordWrap: true,
            wordWrapWidth: this.width - 160,
            breakWords: true
        });
        let txt = new PIXI.Text("这是一段加粗，渐变填色自动换行的文本，中文需要设置breakWords的值为ture才生效", style);
        txt.x = 80;
        txt.y = this.height / 2;
        this.container.addChild(txt);
        console.log('6', style);
    }
    
    update(){
        if(this.txt){
            this.txt.rotation += 0.04;
        }
    }

    destory(): void {
        super.destory();
    }

}