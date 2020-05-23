<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(0)">sprite中心点</div>
            <div class="btn" @click="show(1)">container中心点</div>
            <div class="btn" @click="show(2)">shape画图</div>
        </div>
    </div>

</template>

<script>
import {Game} from '../../core/demo/Game'
import {SpriteTest} from '../../core/demo/SpriteTest'
import {ContainerTest} from '../../core/demo/ContainerTest'
import {ShapeTest} from '../../core/demo/ShapeTest'

let game;
export default {
    data(){
        return {
            name: 'game'
        }
    },
    mounted(){
        game = new Game(this.$refs.canvas);
        this.show(2);
    },
    methods: {
        show(type) {
            switch(type){
                case 0:
                    game.reset(new SpriteTest);
                    break;
                case 1:
                    game.reset(new ContainerTest);
                    break;
                case 2:
                    game.reset(new ShapeTest);
                    break;
            }
            
        },
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>