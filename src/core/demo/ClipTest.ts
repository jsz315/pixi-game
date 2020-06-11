import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { EditView } from '../view/EditView';
import { ScaleTooler } from '../tooler/scaleTooler';

export class ClipTest extends BaseScene{

    url:string = 'man.jpg';
    man:PIXI.Sprite;
    dragging:boolean;
    startPot:any;
    editView:EditView;
    scaleTooler:ScaleTooler;

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
        this.man.anchor.set(0.5, 0.5);
        // this.man.scale.set(0.4, 0.4);
        this.man.position.set(this.width / 2, this.height / 2);
        this.container.addChild(this.man);

        this.editView = new EditView(this.width,this.height);
        this.editView.reset(30, 720, 30, 720);
        this.container.addChild(this.editView);

        this.scaleTooler = new ScaleTooler(this.editView, this.man);
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