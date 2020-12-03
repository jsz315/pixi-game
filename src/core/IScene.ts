import * as PIXI from 'pixi.js';

export interface IScene{
    container: PIXI.Container;
    init(width:number, height:number, app:PIXI.Application):void;
    destory():void;
    update():void;
}