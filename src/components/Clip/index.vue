<template>
    <div class="stage">
        <div class="bg" :style="style" :class="{'pre': hide}"></div>
        <canvas class="canvas" :class="{hide}" ref="canvas"></canvas>
        <div class="control">
            <div class="btns">
                <div class="box" @click="onChange('fitWidth')"><div class="ico size width"></div></div>
                <div class="box" @click="onChange('fitHeight')"><div class="ico size height"></div></div>
            </div>

            <div class="btns">
                <div class="box" @click="onChange('rotateLeft')"><div class="ico rotate left"></div></div>
                <div class="box" @click="onChange('rotateRight')"><div class="ico rotate right"></div></div>
            </div>

            <div class="btns">
                <div class="box" @click="onChange('turnX')"><div class="ico turn x"></div></div>
                <div class="box" @click="onChange('turnY')"><div class="ico turn y"></div></div>
            </div>
            
        </div>
        <div class="clip-btns">
            <div class="clip btn" @click="preStart">预处理</div>
            <div class="clip btn" @click="preCancel">×</div>
            <div class="clip btn" @click="preEnd">√</div>
            <div class="clip btn" @click="clip">裁剪</div>
        </div>

        <div class="preview" v-if="preview">
            <div class="box">
                <div class="img-box">
                    <img v-if="url" :src="url" class="img">
                </div>

                <div class="info" v-if="info">
                    <div class="tip">原始尺寸：{{info.originSize.width}}x{{info.originSize.height}}</div>
                    <div class="tip">裁剪尺寸：{{info.clipSize.width}}x{{info.clipSize.height}}</div>
                </div>

                <div class="scale">
                    <div class="size" @click="changeSize(index)" :class="{selected:scaleId==index}" v-for="(item, index) in scales" v-bind:key="item.label">{{item.label}}</div>
                </div>
                
                <div class="result-btns">
                    <div class="btn" @click="quit">取消</div>
                    <div class="sure btn" @click="sure">确定</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {Game} from '../../core/demo/Game'
// import {SpriteTest} from '../../core/demo/SpriteTest'
// import {PositionTest} from '../../core/demo/PositionTest'
// import {ShapeTest} from '../../core/demo/ShapeTest'
// import {TextTest} from '../../core/demo/TextTest'
// import {DragTest} from '../../core/demo/DragTest'
// import {ScaleTest} from '../../core/demo/ScaleTest'
// import {BlendModeTest} from '../../core/demo/BlendModeTest'
import {ClipTest} from '../../core/demo/ClipTest'

import listener from '../../core/listener'

let game;
export default {
    data(){
        return {
            hide: false,
            url: './logo.png',
            preview: false,
            blob: null,
            info: null,
            scaleId: 0,
            // clipWidth: 0,
            // clipHeight: 0,
            scales: [
                {label: "无缩放", value: 1},
                {label: "750px", value: 750},
                {label: "30%", value: 0.3},
                {label: "50%", value: 0.5},
                {label: "70%", value: 0.7}
            ],
            style: {},
            pic: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                padding: 0
            },
            img: null,
        }
    },
    mounted(){
        game = new Game(this.$refs.canvas);
        game.reset(new ClipTest);
        
        listener.on("clipEnd", (url, blob, info)=>{
            this.preview = true;
            this.url = url;
            this.blob = blob;
            this.info = info;
            console.log(info, "info");
        })

        listener.on("move", offset => {
            var {top, left, width, height, padding} = this.pic;

            if(width > height){
                left += offset.x;
                if(left + width + padding < window.innerWidth){
                    left = window.innerWidth - (width + padding);
                }
                else if(left > padding){
                    left = padding;
                }
            }
            else{
                top += offset.y;
                if(top + height + padding < window.innerWidth){
                    top = window.innerWidth - (height + padding);
                }
                else if(top > padding){
                    top = padding;
                }
            }

            this.pic.left = left;
            this.pic.top = top;

            this.update();
        });

        listener.on("pre-div", rect => {
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
    },
    methods: {
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        quit(){
            this.preview = false;
        },
        sure(){
            this.preview = false;
            var data = {
                type: "complete",
                url: this.url,
                blob: this.blob,
                info: this.info
            }
            console.log("裁剪完成", data);
            window.parent.postMessage(data);
        },
        changeSize(n){
            this.scaleId = n;
            if(this.scaleId == 1){
                listener.emit("clipStart", this.scales[this.scaleId].value / this.info.originSize.width);
            }
            else{
                listener.emit("clipStart", this.scales[this.scaleId].value);
            }
        },
        clip(){
            listener.emit("clipStart", 1);
        },
        onChange(type){
            listener.emit("transform", type);
        },
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
        preEnd(){
            var r = window.innerWidth / 750;
            var {left, top, width, height} = this.pic;
            listener.emit("preClip", {
                left: left / r,
                top: top / r,
                width: width / r,
                height: height / r,
                img: this.img
            });
            listener.emit("preStart", false);
            this.hide = false;
        },
        preCancel(){
            listener.emit("preStart", false);
            this.hide = false;
        },
        preStart(){
            listener.emit("preStart", true);

            this.hide = true;
            var url = this.getQueryString("url");
            this.style = {
                backgroundImage: "url(" + url + ")",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }

            var img = new Image();
            img.onload = () => {
                this.img = img;

                listener.emit("pre-scale", img.width > img.height);
            }
            img.src = url;
            
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>