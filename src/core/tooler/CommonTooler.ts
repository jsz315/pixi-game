export default class CommonTooler{


    static loadImage(url:string){
        return new Promise(resolve => {
            var img = new Image();
            img.crossOrigin = '';
            console.log(`image crossOrigin: ${img.crossOrigin}`);
            img.onload = function(){
                resolve(img);
            }
            img.src = url;
        })
        
    }

    static async checkTexture(texture:any){
        var timer = Date.now();
        var num = 0;
        while(++num < 30){
            await CommonTooler.sleep(30);
            if(texture.width > 10){
                break;
            }
        }
        var t = Date.now() - timer;
        console.log(`texture init cost: ${t}ms`);
        return num;
    }

    static sleep(t:number){
        return new Promise(resolve=>{
            setTimeout(() => {
                resolve();
            }, t);
        })
    }

    static getQueryString(name:string):any {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
    }

    static getDistance(a:any, b:any){
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    static getCenter(a:any, b:any){
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }

    /**
     * 判断图片是否为png，根据像素透明值判断
     * @param url 图片链接，本地或远程
     */
    static async checkPng(url:string){
        var timer = Date.now();
        var img: any = await CommonTooler.loadImage(url);
        
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
}