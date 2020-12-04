<template>
    <div class="page">

        <div class="stage">
            <div class="pic" :style="style" v-show="useDom"></div>
            <canvas class="canvas" :class="{'hide': useDom}" ref="canvas"></canvas>
        </div>

        <div class="bottom">

            <div class="state">
                <div class="tip">原始尺寸：{{originSize.width}}x{{originSize.height}}</div>
                <div class="tip">裁剪尺寸：{{clipSize.width}}x{{clipSize.height}}</div>
            </div>

            <div class="control">
                <div class="btns">
                    <div class="box" @click="onTransform('fitWidth')"><div class="ico size width"></div></div>
                    <div class="box" @click="onTransform('fitHeight')"><div class="ico size height"></div></div>
                </div>

                <div class="btns">
                    <div class="box" @click="onTransform('rotateLeft')"><div class="ico rotate left"></div></div>
                    <div class="box" @click="onTransform('rotateRight')"><div class="ico rotate right"></div></div>
                </div>

                <div class="btns">
                    <div class="box" @click="onTransform('turnX')"><div class="ico turn x"></div></div>
                    <div class="box" @click="onTransform('turnY')"><div class="ico turn y"></div></div>
                </div>
                
            </div>
            <div class="clip-btns">
                <div class="clip btn" @click="onStartDom" v-show="!useDom">预处理</div>
                <div class="clip btn" @click="onEndDom(false)" v-show="useDom">×</div>
                <div class="clip btn" @click="onEndDom(true)" v-show="useDom">√</div>
                <div class="clip btn" @click="onClip" v-show="!useDom">裁剪</div>
            </div>
        </div>
        
        <Preview @clip="onSure" @scale="onScale" ref="preview"></Preview>
    </div>

</template>

<script>
import {Game} from '../../core/Game'
import {ImageCliper} from '../../core/web/ImageCliper'
import CommonTooler from '../../core/tooler/CommonTooler'

import listener from '../../core/listener'
import Preview from '@/components/Preview'

let game;
export default {
    data(){
        return {
            // inPre: false,
            // hide: false,
            useDom: false,
            style: {},
            pic: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                padding: 0
            },
            originSize: {
                width: 0,
                height: 0
            },
            clipSize: {
                width: 0,
                height: 0
            },
            img: null,
            url: "", 
            blob: null, 
            info: null
        }
    },
    components: {Preview},
    mounted(){
        game = new Game(this.$refs.canvas);
        game.reset(new ImageCliper);

        //初始化图片尺寸
        listener.on("initSize", (w, h) => {
            this.originSize.width = w;
            this.originSize.height = h;
        })

        //设置裁剪后的真实尺寸
        listener.on("clipSize", (w, h) => {
            this.clipSize.width = parseInt(w);
            this.clipSize.height = parseInt(h);
        })
        
        //裁剪完成
        listener.on("clipEnd", (url, blob, info)=>{
            this.url = url;
            this.blob = blob;
            this.info = info;
            this.$refs.preview.show(url, info);
        })

        //dom截图模式框尺寸变换
        listener.on("domSize", (w, h) => {
             var r = window.innerWidth / 750;
            var s = this.pic.width / this.originSize.width / r;
            this.clipSize.width = parseInt(w / s);
            this.clipSize.height = parseInt(h / s);
        })

        //移动dom图片
        listener.on("move", offset => {
            console.log("pic move")
            var {top, left, width, height, padding} = this.pic;
            if(width > height){
                left += offset.x;
            }
            else{
                top += offset.y;
            }

            this.pic.left = left;
            this.pic.top = top;

            this.update();
        });
    },
    methods: {
        onSure(){
            var data = {
                type: "complete",
                url: this.url,
                blob: this.blob,
                info: this.info
            }
            console.log("clip complete", data);
            window.parent.postMessage(data);
        },

        //设置缩放尺寸预览
        onScale(obj){
            // this.scaleId = n;
            if(obj.value == 750){
                listener.emit("clipPreview", obj.value / this.originSize.width);
            }
            else{
                listener.emit("clipPreview", obj.value);
            }
        },

        //预览
        onClip(){
            listener.emit("clipPreview", 1);
        },

        //变换图片
        onTransform(type){
            listener.emit("transform", type);
        },

        //更新dom图片位置
        update(){
            var obj = {
                top: this.pic.top + "px",
                left: this.pic.left + "px",
                width: this.pic.width + "px",
                height: this.pic.height + "px",
            }
            var style = Object.assign(this.style, obj);
            this.style = style;
        },

        //裁剪dom图片结束
        onEndDom(use){
            var param = null;
            if(use){
                var r = window.innerWidth / 750;
                var {left, top, width, height} = this.pic;
                param = {
                    left: left / r,
                    top: top / r,
                    width: width / r,
                    height: height / r,
                    img: this.img
                };
            }
            else{
                this.onTransform('fitWidth');
            }
            
            listener.emit("endDom", param);
            this.useDom = false;
        },

        //始使用dom图片
        async onStartDom(){
            this.useDom = true;

            var url = CommonTooler.getQueryString("url");
            this.style = {
                backgroundImage: "url(" + url + ")",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
            
            var img = await CommonTooler.loadImage(url);
            this.img = img;

            listener.emit("startDom", img.width > img.height, (rect) => {
                var left = rect.left;
                var top = rect.top;
                var width = rect.right - rect.left;
                var height = rect.bottom - rect.top;
                var padding = Math.min(left, top);

                if(width > height){
                    width = this.img.width * height / this.img.height;
                }
                else{
                    height = this.img.height * width / this.img.width;
                }

                var r = window.innerWidth / 750;

                width = width * r;
                height = height * r;
                left = left * r;
                top = top * r;
                padding = padding * r;

                this.pic = {left, top, width, height, padding};
                console.log(this.pic, "pic");
                this.update();
            });
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>