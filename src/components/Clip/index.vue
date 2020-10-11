<template>
    <div class="stage">
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="clip-btns">
            <div class="btn" @click="fitWidth">适配宽</div>
            <div class="btn" @click="fitHeight">适配高</div>
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
            ]
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
            // this.clipWidth = info.clipSize.width;
            // this.clipHeight = info.clipSize.heigth;
        })
    },
    methods: {
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
        fitWidth(){
            listener.emit("fitWidth");
        },
        fitHeight(){
            listener.emit("fitHeight");
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>