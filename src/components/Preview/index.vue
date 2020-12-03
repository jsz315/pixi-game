<template>
    <div class="preview" v-if="visible">
        <div class="box">
            <div class="img-box">
                <img v-if="url" :src="url" class="img">
            </div>

            <div class="info" v-if="info">
                <!-- <div class="tip">裁剪尺寸：{{info.originSize.width}}x{{info.originSize.height}}</div> -->
                <div class="tip">裁剪尺寸：{{info.clipSize.width}}x{{info.clipSize.height}}</div>
                <div class="tip">缩放尺寸：{{info.originSize.width}}x{{info.originSize.height}}</div>
            </div>

            <div class="scale">
                <div class="size" @click="onChangeSize(index)" :class="{selected:scaleId==index}" v-for="(item, index) in scales" v-bind:key="item.label">{{item.label}}</div>
            </div>
            
            <div class="result-btns">
                <div class="btn" @click="onCancel">取消</div>
                <div class="sure btn" @click="onSure">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import CommonTooler from '../../core/tooler/CommonTooler'
import listener from '../../core/listener'

let game;
export default {
    data(){
        return {
            inPre: false,
            hide: false,
            url: './logo.png',
            visible: false,
            blob: null,
            info: null,
            scaleId: 0,
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
        // //初始化图片尺寸
        // listener.on("initSize", (w, h) => {
        //     this.originSize.width = w;
        //     this.originSize.height = h;
        // })

        // //设置裁剪后的真实尺寸
        // listener.on("clipSize", (w, h) => {
        //     this.clipSize.width = w;
        //     this.clipSize.height = h;
        // })
        
        // //裁剪完成
        // listener.on("clipEnd", (url, blob, info)=>{
        //     this.preview = true;
        //     this.url = url;
        //     this.blob = blob;
        //     this.info = info;
        //     console.log(info, "info");
        // })
    },
    methods: {
        show(url, info){
            this.visible = true;
            this.url = url;
            this.info = info;
        },
        onCancel(){
            this.visible = false;
        },
        onSure(){
            this.visible = false;
            var data = {
                type: "complete",
                url: this.url,
                blob: this.blob,
                info: this.info
            }
            console.log("clip complete", data);
            this.$emit("clip", data);
            // window.parent.postMessage(data);
        },

        //设置缩放尺寸预览
        onChangeSize(n){
            this.scaleId = n;
            this.$emit("scale", this.scales[n]);
            // if(this.scaleId == 1){
            //     listener.emit("clipPreview", this.scales[this.scaleId].value / this.info.originSize.width);
            // }
            // else{
            //     listener.emit("clipPreview", this.scales[this.scaleId].value);
            // }
        },

    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>