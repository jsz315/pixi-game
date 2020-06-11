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

}