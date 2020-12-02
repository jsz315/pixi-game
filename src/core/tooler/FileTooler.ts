import Common from "./Common";

export class FileTooler{

    static dataURLtoBlob(dataurl:string) {
        var arr:any = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    static blobToURL(blob:any){
        return URL.createObjectURL(blob);
    }

    static blobToDataURL(blob:any) {
        return new Promise(resolve => {
            let a = new FileReader();
            a.onload = (e:any) => { 
                resolve(e.target.result); 
            }
            a.readAsDataURL(blob);
        })
    }

    static getClipImage(img:any, x:number, y:number, width:number, height:number){
        var canvas:HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);
        // document.body.appendChild(canvas);
        return canvas;
    }

    static getUrlCanvas(url:string){
        return new Promise(resolve => {
            var img = new Image();
            img.crossOrigin = '';
            img.onload = async function(e){
                var canvas:HTMLCanvasElement = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx?.save();
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                ctx?.restore();

                document.body.appendChild(canvas);
                setTimeout(() => {
                    resolve(canvas);
                }, 30);
            }
            img.src = url;
        })
    }

    static getRotateCanvas(img:HTMLCanvasElement, angle:number){
        return new Promise(resolve => {
            var canvas:HTMLCanvasElement = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx?.save();
            if(angle == 90 || angle == -90){
                canvas.width = img.height;
                canvas.height = img.width;
                
                ctx?.translate(canvas.width / 2, canvas.height / 2);
                ctx?.rotate(angle * Math.PI / 180);
                ctx?.drawImage(img, -img.width / 2, -img.height / 2);
                
            }
            else{
                canvas.width = img.width;
                canvas.height = img.height;

                ctx?.translate(img.width / 2, img.height / 2);
                ctx?.rotate(angle * Math.PI / 180);
                ctx?.drawImage(img, -img.width / 2, -img.height / 2);
            }
            ctx?.restore();
            setTimeout(() => {
                resolve(canvas);
            }, 30);
        })

        // var ctx = canvas.getContext('2d');
        // ctx?.save();
        // console.log(angle, "angler");
        // if(angle == 90 || angle == -90){
        //     var cw = canvas.width;
        //     var ch = canvas.height;
        //     canvas.width = ch;
        //     canvas.height = cw;
            
        //     ctx?.translate(ch, 0);
        //     ctx?.rotate(angle * Math.PI / 180);
        //     ctx?.drawImage(canvas, 0, 0);
            
        // }
        // else{
            
        //     ctx?.translate(canvas.width / 2, canvas.height / 2);
        //     ctx?.rotate(angle * Math.PI / 180);
        //     ctx?.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
        // }
        // ctx?.restore();
    }

    static scaleCanvas(canvas:HTMLCanvasElement, x:number, y:number){
        var ctx = canvas.getContext('2d');
        ctx?.save();
        ctx?.scale(x, y);
        ctx?.drawImage(canvas, 0, 0, x * canvas.width, y* canvas.height);
        ctx?.restore();
    }

    static getCanvas(url:string, angle:number){
        var img = new Image();
        img.setAttribute("crossOrigin", "");
        console.log(img.crossOrigin, "crossOrigin");
        img.onload = async function(e){
            var canvas:HTMLCanvasElement = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx?.save();
            if(angle == 90 || angle == -90){
                canvas.width = img.height;
                canvas.height = img.width;
                
                ctx?.translate(canvas.width / 2, canvas.height / 2);
                ctx?.rotate(angle * Math.PI / 180);
                ctx?.drawImage(img, -img.width / 2, -img.height / 2);
                
            }
            else{
                canvas.width = img.width;
                canvas.height = img.height;

                ctx?.translate(img.width / 2, img.height / 2);
                ctx?.rotate(angle * Math.PI / 180);
                ctx?.drawImage(img, -img.width / 2, -img.height / 2);
            }
            ctx?.restore();
        }
        img.src = url;
    }

    /**
     * 判断图片是否为png，根据像素透明值判断
     * @param url 图片链接，本地或远程
     */
    static async checkPng(url:string){
        var timer = Date.now();
        var img: any = await Common.loadImage(url);
        
        var canvas:any = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var w = Math.floor(img.width / 10);
        var h = Math.floor(img.height / 10);
        
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
        var imgData = ctx.getImageData(0, 0, w, h);
        var isPng = false;
        for(var i = 0; i < h; i++){
            // var list = [];
            for(var j = 0; j < w; j++){
                var n = i * w * 4 + j * 4;
                if(imgData.data[n + 3] < 10){
                    isPng = true;
                    break;
                    // list.push(".");
                }
                else{
                    // list.push("m");
                }
                if(isPng){
                    break;
                }
            }
            // console.log(list.join(""));
        }
        var t = Date.now() - timer;
        console.log(`check is png: ${isPng}, cost：${t}ms`);
        return isPng;
        
    }

    static isPngFile(blob:any){
        return new Promise(resolve => {
            var file = new FileReader();
            file.onload = function(e: any){
                var s = new  Uint8Array(e.target.result);
                var list = s.slice(0, 8);
                if(list.join(",") == "137,80,78,71,13,10,26,10"){
                    console.log("is png");
                    resolve(true);
                }
                else{
                    console.log("not png");
                    resolve(false);
                }
            }
            file.readAsArrayBuffer(blob);
        })
        
    }

}