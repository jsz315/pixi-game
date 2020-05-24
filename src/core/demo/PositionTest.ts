import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class PositionTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';
    txt:PIXI.Text;
    box:PIXI.Container;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);

        this.box = this.addBox();
        var rect = this.addRect();
        this.man = this.addMan();
        this.txt = this.addText();

        this.man.x = 100;
        this.man.y = 100;

        this.box.addChild(rect);
        this.box.addChild(this.man);

        this.box.x = 100;
        this.box.y = 100;

        this.txt.x = 30;
        this.txt.y = this.height - 30;

        this.container.addChild(this.box);
        this.container.addChild(this.txt);

        this.container.interactive = true;

        this.container.on("pointerdown", this.onClick.bind(this));
    }

    addMan():PIXI.Sprite{
        var man = new PIXI.Sprite(this.loader.resources[this.url].texture);
        man.interactive = true;
        // this.man.position.set(this.width / 2, this.height / 2);
        // this.man.anchor.set(0, 0);
        man.scale.set(0.4, 0.4);
        return man;
    }

    addBox():PIXI.Container{
        var box = new PIXI.Container();
        this.container.addChild(box);
        return box;
    }

    addRect():PIXI.Graphics{
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xff9900);
        graphics.beginFill(0x884422);
        graphics.drawRect(0, 0, 500, 400);
        graphics.endFill();
        return graphics;
    }

    addText():PIXI.Text{
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 28,
            fill: "#ffffff",
            stroke: '#333333',
            strokeThickness: 6,
            wordWrap: true,
            wordWrapWidth: this.width - 60,
            breakWords: true,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 3,
            dropShadowAngle: Math.PI / 3,
            dropShadowDistance: 4,
        });
        var txt = new PIXI.Text("点击图片", style);
        txt.anchor.set(0, 1);
        return txt;
    }

    onClick(e:any){
        console.log(e);
        var global = e.data.global;
        var local1 = e.data.getLocalPosition(this.box);
        var local2 = e.data.getLocalPosition(this.man);

        console.log(global, 'global');
        console.log(local1, 'local1');
        console.log(local2, 'local2');
        var list = [
            `全局: ${global.x.toFixed(0)},  ${global.y.toFixed(0)}`,
            `容器: ${local1.x.toFixed(0)},  ${local1.y.toFixed(0)}`,
            `本地: ${local2.x.toFixed(0)},  ${local2.y.toFixed(0)}`
        ];
        
        this.txt.text = list.join("\n");
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