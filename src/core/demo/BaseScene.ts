import * as PIXI from 'pixi.js';
import { IScene } from './IScene';

export class BaseScene implements IScene{
    loader: PIXI.Loader;
    width:number;
    height:number;
    container: PIXI.Container;
    app:PIXI.Application;
    
    constructor(){
        this.loader = PIXI.Loader.shared;
        this.container = new PIXI.Container();
    }

    load(url:string):Promise<void>{
        return new Promise(resolve => {
            if(this.loader.resources[url]){
                console.log("no load")
                resolve();
            }
            else{
                console.log("loading")
                this.loader.add({
                    url: url,
                    //crossOrigin为空不等于anonymous
                    crossOrigin: 'anonymous'
                }).load(()=>{
                    resolve();
                });
            }
        })
    }

    init(width:number, height:number, app:PIXI.Application):void{
        this.width = width;
        this.height = height;
        this.app = app;
    }

    update(){
        
    }

    destory(): void {
        this.container.destroy({
            children: true
        })
    }
}