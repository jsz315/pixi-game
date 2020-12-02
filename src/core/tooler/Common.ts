export default class Common{


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
            await Common.sleep(30);
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
}