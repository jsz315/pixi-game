import * as PIXI from 'pixi.js';
import { IScene } from './IScene';

export class Game{
    canvas:any;
    app:PIXI.Application;
    loader: PIXI.Loader;
    width:number;
    height:number;
    man:PIXI.Sprite;
    url:string = 'man.jpg';

    scene:IScene;

    constructor(canvas:any){
        this.canvas = canvas;
        this.init();
    }

    init(){
        this.width = window.innerWidth;
        this.height = window.innerWidth;
        this.app = new PIXI.Application({
            autoStart: true,
            width: this.width,
            height: this.height,
            view: this.canvas,
            antialias: true
        })

        this.app.renderer.backgroundColor = 0xf0f0f0;
        console.log(this.app, "app");
        this.app.ticker.add(this.loop.bind(this));
    }

    reset(scene:IScene){
        if(this.scene){
            this.scene.destory();
        }
        this.scene = scene;
        this.scene.init(this.width, this.height);
        this.app.stage.addChild(this.scene.container);
    }

    destroy(){
        console.log("destroy");
    }

    loop(){
        if(this.scene){
            this.scene.update();
        }
    }
}