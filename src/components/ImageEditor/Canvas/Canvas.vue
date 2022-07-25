<template>
    <div class="canvas" ref="container"/>
</template>

<script>
import Canvas from './NativeComponent/Canvas'
import EventEmitter from 'eventemitter3'

export default {
    name: "Canvas",
    props: {
        data: Object,
        event: EventEmitter
    },
    mounted() {
        this.container = this.$refs.container;
        this.canvas = new Canvas(this.container, this.event);
        this.canvas.load(this.data);
    },
    watch: {
        data() {
            this.canvas.load(this.data);
        }
    }
}
</script>

<style scoped>
 .canvas {
   display: flex;
   justify-content: center;
 }
</style>
