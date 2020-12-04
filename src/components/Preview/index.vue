<template>
    <div class="preview" v-if="visible">
        <div class="box">
            <div class="img-box">
                <img v-if="url" :src="url" class="img">
            </div>

            <div class="info" v-if="info">
                <!-- <div class="tip">裁剪尺寸：{{info.originSize.width}}x{{info.originSize.height}}</div> -->
                <div class="tip">裁剪尺寸：{{info.clipSize.width}}x{{info.clipSize.height}}</div>
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
            url: '',
            visible: false,
            info: null,
            scaleId: 0,
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
            this.$emit("clip");
        },

        //设置缩放尺寸预览
        onChangeSize(n){
            this.scaleId = n;
            this.$emit("scale", this.scales[n]);
        },

    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>