import CommonTooler from "./CommonTooler";

export default class CanvasTooler{

    //根据图片获取裁剪内容的离线画布
    static getClipCanvas(img:any, x:number, y:number, width:number, height:number){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);
        return canvas;
    }

    //根据图片链接获取原始内容的离线画布
    static async getCanvasByUrl(url:string){
        var canvas = document.createElement("canvas");
        var img:any = await CommonTooler.loadImage(url);
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        return canvas;
    }

    //根据图片获取缩放内容的离线画布
    static getScaleCanvas(img:HTMLCanvasElement, x:number, y:number){
        var canvas = document.createElement("canvas");
        canvas.width = img.width * Math.abs(x);
        canvas.height = img.height * Math.abs(y);
        var ctx = canvas.getContext("2d");

        ctx?.save();
        ctx?.scale(x, y);
        
        ctx?.drawImage(
            img, 
            x > 0 ? 0 : x * img.width, 
            y > 0 ? 0 : y * img.height
        );
        ctx?.restore();
        return canvas;
    }

    //根据图片获取旋转内容的离线画布
    static getRotateCanvas(img:HTMLCanvasElement, angle:number){
        var canvas = document.createElement("canvas");
        if(angle == 90 || angle == -90){
            canvas.width = img.height;
            canvas.height = img.width;
        }
        var ctx = canvas.getContext("2d");

        ctx?.save();
        ctx?.rotate(angle * Math.PI / 180);
        if(angle == 90){
            ctx?.translate(0, -img.height);
        }
        else{
            ctx?.translate(-img.width, 0);
        }
        
        ctx?.drawImage(img, 0, 0);
        ctx?.restore();
        return canvas;
    }
}