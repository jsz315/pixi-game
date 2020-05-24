import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class SpriteTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';
    // url:string = 'https://erp1.mendaot.com/data/json/windowlibrary/125/33990177645/window_1588226643523.jpg';

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
        this.man.position.set(this.width / 2, this.height / 2);
        this.man.anchor.set(0.5, 0.5);
        this.man.scale.set(0.4, 0.4);
        // this.man.pivot.set(this.man.texture.width / 2, this.man.texture.height / 2);
        this.container.addChild(this.man);
    }

    update(){
        if(this.man){
            this.man.rotation += 0.01;
        }
    }

    destory(): void {
        super.destory();
    }

}