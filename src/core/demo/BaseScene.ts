import * as PIXI from 'pixi.js';
import { IScene } from './IScene';

export class BaseScene implements IScene{
    loader: PIXI.Loader;
    width:number;
    height:number;
    container: PIXI.Container;

    constructor(){
        this.loader = PIXI.Loader.shared;
        this.container = new PIXI.Container();
    }

    load(url:string):Promise<void>{
        return new Promise(resolve => {
            if(this.loader.resources[url]){
                resolve();
            }
            else{
                this.loader.add({
                    url: url,
                    crossOrigin: ''
                }).load(()=>{
                    resolve();
                });
            }
        })
    }

    init(width:number, height:number):void{
        this.width = width;
        this.height = height;
    }

    update(){
        
    }

    destory(): void {
        this.container.destroy({
            children: true
        })
    }
}