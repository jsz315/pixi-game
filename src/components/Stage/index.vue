<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(item)" v-for="(item, index) in list" v-bind:key="index">{{item.name}}</div>
        </div>
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

let game;
export default {
    data(){
        return {
            name: '',
            list: [
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
            ]
        }
    },
    mounted(){
        game = new Game(this.$refs.canvas);
        this.show(this.list[0]);
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