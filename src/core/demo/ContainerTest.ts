import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';

export class ContainerTest extends BaseScene{
    
    man:PIXI.Sprite;
    url:string = 'man.jpg';

    constructor(){
        super();
    }   

    init(width:number, height:number):void{
        super.init(width, height);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);
        this.man = new PIXI.Sprite(this.loader.resources[this.url].texture);
        this.man.position.set(this.width / 2, this.height / 2);
        this.man.anchor.set(0, 0);
        this.man.scale.set(0.2, 0.2);
        this.man.pivot.set(this.man.texture.width / 2, this.man.texture.height / 2);
        this.container.addChild(this.man);
    }

    update(){
        if(this.man){
            this.man.rotation += 0.04;
        }
    }

    destory(): void {
        super.destory();
    }

}