<template>
    <div class="stage">
        <div class="bg" :style="style"></div>
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
            <div class="clip btn" @click="pre">预处理</div>
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
            style: {}
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
        pre(){
            listener.emit("pre", true);
            this.hide = true;
            var url = this.getQueryString("url");
            this.style = {
                background: "url(" + url + ")",
                width: '690px',
                height: '690px',
                top: '40px',
                left: '40px'
            }
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>