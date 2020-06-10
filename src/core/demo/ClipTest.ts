import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { EditView } from '../view/EditView';

export class ClipTest extends BaseScene{
    
    dragItem:PIXI.Sprite;
    url:string = 'man.jpg';
    dragging:boolean;
    startPot:any;
    editView:EditView;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
    }
    
    async setup(){
        await this.load(this.url);

        this.editView = new EditView();
        this.editView.reset(30, 720, 30, 720);
        this.container.addChild(this.editView);

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