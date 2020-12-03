<template>
    <div class="page">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(item)" v-for="(item, index) in list" v-bind:key="index">{{item.name}}</div>
        </div>
        <img v-if="src" :src="src" class="img">
    </div>

</template>

<script>
import {Game} from '../../core/Game'
import {SpriteDemo} from '../../core/demo/SpriteDemo'
import {PositionDemo} from '../../core/demo/PositionDemo'
import {ShapeDemo} from '../../core/demo/ShapeDemo'
import {TextDemo} from '../../core/demo/TextDemo'
import {DragDemo} from '../../core/demo/DragDemo'
import {ScaleDemo} from '../../core/demo/ScaleDemo'
import {BlendModeDemo} from '../../core/demo/BlendModeDemo'
import {TextureDemo} from '../../core/demo/TextureDemo'

import listener from '../../core/listener'

let game;
export default {
    data(){
        return {
            name: '',
            src: '',
            list: [
                {
                    name: '贴图',
                    component: TextureDemo
                },
                {
                    name: 'Sprite中心点',
                    component: SpriteDemo
                },
                {
                    name: 'Position坐标转换',
                    component: PositionDemo
                },
                {
                    name: 'Shape画图',
                    component: ShapeDemo
                },
                {
                    name: 'Text文字',
                    component: TextDemo
                },
                {
                    name: '拖动物体',
                    component: DragDemo
                },
                {
                    name: '缩放物体',
                    component: ScaleDemo
                },
                {
                    name: '混合模式',
                    component: BlendModeDemo
                },
            ]
        }
    },
    mounted(){
        game = new Game(this.$refs.canvas);
        this.show(this.list[0]);
        listener.on("draw", (data)=>{
            console.log("draw");
            this.src = data;
        })
    },
    methods: {
        show(item) {
            this.name = item.name;
            game.reset(new item.component);
        },
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>