export default class CanvasTooler{

    static getCanvasByUrl(url:string){
        return new Promise(resolve=>{
            var canvas = document.createElement("canvas");
            var img = new Image();
            img.crossOrigin = '';
            console.log(img.crossOrigin, "crossOrigin")
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                resolve(canvas);
            }
            img.src = url;
        })

    }

    static scaleCanvas(img:HTMLCanvasElement, x:number, y:number){
        var canvas = document.createElement("canvas");
        canvas.width = img.width * Math.abs(x);
        canvas.height = img.height * Math.abs(y);
        var ctx = canvas.getContext("2d");

        ctx?.save();
        // ctx?.translate(-img.width / 2, -img.height / 2)
        ctx?.scale(x, y);
        
        ctx?.drawImage(
            img, 
            x > 0 ? 0 : x * img.width, 
            y > 0 ? 0 : y * img.height
        );
        ctx?.restore();
        return canvas;
    }

    static rotateCanvas(img:HTMLCanvasElement, angle:number){
        var canvas = document.createElement("canvas");
        if(angle == 90 || angle == -90){
            canvas.width = img.height;
            canvas.height = img.width;
        }
        var ctx = canvas.getContext("2d");

        ctx?.save();
        // ctx?.translate(-img.width / 2, -img.height / 2)
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