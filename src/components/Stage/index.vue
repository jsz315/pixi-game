<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(item)" v-for="(item, index) in list" v-bind:key="index">{{item.name}}</div>
        </div>
        <img v-if="src" :src="src" class="img">
    </div>

</template>

<script>
import {Game} from '../../core/demo/Game'
import {SpriteTest} from '../../core/demo/SpriteTest'
import {PositionTest} from '../../core/demo/PositionTest'
import {ShapeTest} from '../../core/demo/ShapeTest'
import {TextTest} from '../../core/demo/TextTest'
import {DragTest} from '../../core/demo/DragTest'
import {ScaleTest} from '../../core/demo/ScaleTest'
import {BlendModeTest} from '../../core/demo/BlendModeTest'
import {ClipTest} from '../../core/demo/ClipTest'
import {TextureTest} from '../../core/demo/TextureTest'

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
                    component: TextureTest
                },
                {
                    name: '裁剪图片',
                    component: ClipTest
                },
                {
                    name: 'Sprite中心点',
                    component: SpriteTest
                },
                {
                    name: 'Position坐标转换',
                    component: PositionTest
                },
                {
                    name: 'Shape画图',
                    component: ShapeTest
                },
                {
                    name: 'Text文字',
                    component: TextTest
                },
                {
                    name: '拖动物体',
                    component: DragTest
                },
                {
                    name: '缩放物体',
                    component: ScaleTest
                },
                {
                    name: '混合模式',
                    component: BlendModeTest
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