<template>
  <div class="imageEditorApp">
    <!--    <tui-image-editor-->
    <!--      ref="tuiImageEditor"-->
    <!--      :options="options"-->
    <!--      @addText="onAddText"-->
    <!--      @objectActivated="onObjectActivated"-->
    <!--      @objectScaled="onObjectScaled"-->
    <!--      @selectionCreated="onSelectionCreated"-->
    <!--    >-->
    <!--    </tui-image-editor>-->
    <Canvas :data="data" :event="event"/>
  </div>
</template>

<script>
import Canvas from './Canvas/Canvas';
import EventEmitter from 'eventemitter3';

import 'util/jQuery_v1.10.2';
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-image-editor/dist/tui-image-editor.css";
const ImageEditor = require("tui-image-editor");
import "./css/fontFace.css";
import { ImageEditorExtend } from "./imageEditorExtend";

export default {
  data() {
    return {};
  },

  props: {
    data: Object
  },

  components: {
    Canvas,
  },

  methods: {
    instance() {
      return new ImageEditor(document.querySelector(".imageEditorApp"), {
        includeUI: {
          loadImage: {
            path: require("./image/img.png"),
            name: "sample",
          },
          initMenu: "filter",
          uiSize: {
              width: _$(".imageEditorApp ").parent().width() + 'px',
              height: "900px",
          },
          menuBarPosition: "bottom", // 'top', 'bottom', 'left', 'right'
        },
        cssMaxWidth: 800,
        cssMaxHeight: 600,
      });
    },

    addEvent() {
      this.imageEditor.on("addText", function () {
        ImageEditorExtend.onAddText();
      });
      this.imageEditor.on("objectActivated", function (e) {
        ImageEditorExtend.onObjectActivated(e);
      });
      this.imageEditor.on("objectScaled", function (e) {
        ImageEditorExtend.onObjectScaled(e);
      });
      this.imageEditor.on("selectionCreated", function (e) {
        ImageEditorExtend.onSelectionCreated(e);
      });
    },
  },

  created() {
    this.event = new EventEmitter();
  },

  mounted() {
    this.imageEditor = this.instance();
    this.addEvent();

    ImageEditorExtend.imageEditor = this.imageEditor;
    ImageEditorExtend.instance();
    window._imageEditor = ImageEditorExtend.invoke;
  },
};

/**
 * load image
 * _imageEditor.loadImage('https://images.51microshop.com/1818/product/20180725/Request_A_Sample_1532534180500_0.jpg')
 */
</script>

<style>
/*
        width可以改变右边滚动条的宽度
        height可以改变下边滚动条的高度
        */
.tui-image-editor-menu-mask ::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  box-sizing: border-box;
}
/*
设置了滚动条按钮的样式图标，url我直接用了base64图片，无所谓啦
*/
.tui-image-editor-menu-mask ::-webkit-scrollbar-button {
  width: 0;
  height: 0;
    background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAUCAYAAADRA14pAAADr0lEQVRYR71Yy04iQRQtE10IRiSBOLbOUvZmfkIlLHXjI+jCDzAm8w8TJKxZyENdqEui8BPuDVtsHCNGQcFEWUzdSt/KtbqqqZ44U0kn1V2n69xz63W6x5h9iXFoNADe521dftnibJlt+7PCjdmycpzz9vbmmvCTk5PzvK0NuNvbWyNuYWEBcbbUX8obSvBgMDAKiUQiUrDLi0nNPC9eYqwFfyWvTvAPHsm1JhqHEl9dXbHV1VUJo4Lv7u6k4JOTE7a5uSlxc3Nz/0ww5VXjR15VMIjFoop2+v2+EAJisaDoaDQqR/j+/l7gjo+PJW5ra0vUZ2dnqWDko1zqM+fi4kL0RxOMMaytrUneXC4ncMhFYzg4OBA4KpiK1Yl2Xl9fXSqWip6ampLEDw8PbrVa9U2S7e1tlkwmdYIBC6J1CXfOz8/ljAHRNIbFxcXs0tJShb/rHB4eShxw0RgymczPVCr1CwWrRCOJeQesVqtJUevr61JwPp+XxHt7e6xYLErc/v6+OqVHJvrl5cWt1+u+BEIMNzc3UvDj46NbqYD2zwViaLfbWsGBU+vs7EwIASIow+GQYSA8e5K4UCgIHBBBeX9/Z+VyWdT5CAliJabApdTr9UR/VDTGQPeO5+dngUMuGgPiQu3S3W7XHR8fl2IxaHjWbDalYAhwYmJCNH98fEht8KzVaukEA8a4WQIvdgKiacJjsZicWZgYwJZKJZlwiGF6etq3hpWk+24dzKAOODMzI4lhrZs6I2t9FB+2+3ghcZjIIF4YCJiFUJA31AjbCrY8N/9aMH2RCrbhDSP4OydKBETZ4W09fn3jV8SAG/Dnv/kFFtS22PC2eGdWOJNg3fnos3iXl5ci6HQ6zTxryVRbeXp6KjAbGxvMYCt1XDQZgpdy0UbV0lI+ikNuk9NCLN21fU4LQXA2ersgbP+fXBZiwG05jqNzWUE7NLwueHVmBxrpLg3c4OwoJ9aR+6udFgvhsugA/DeHZ3JaWi+tOi1q9bxdkHU6nU8uCxwPlkQiEeSjTaKFw8M+1JGmDg+4EUddFsSA3KFGWGcAVlZWBId3zrGnpyff4Z/NZgUmHo+bBIc2Hgqv+Cy14Q61hlUDgNkEcs8AMPXwR8zOzo48/Olc5vWRaxh4qctCsdCPajzAcFBOrI8yHtpdWj2HG42G6G95eZl55yHDLyokOjo6EtXd3V1Gvqh061e3jAAnjAfloi/Tcxi4KR/FIXeYc9jmFwpw2PwGUgY58NaG1/rX0h9d1DUzJEP0JgAAAABJRU5ErkJggg==) no-repeat;
}
/*
corner角落的意思，可以改变Y滚动条与X滚动条交叉的右下角的样式
*/
.tui-image-editor-menu-mask ::-webkit-scrollbar-corner {
  background-color: #f1f1f1;
  -webkit-border-radius: 1px;
}
/*
这就是滚动条的样式了
*/
.tui-image-editor-menu-mask ::-webkit-scrollbar-thumb {
  background-color: #808080;
  border: 1px solid #808080;
  /*-webkit-border-radius: 5px;*/
}
/*
悬浮时
*/
.tui-image-editor-menu-mask ::-webkit-scrollbar-thumb:hover {
  background-color: #f6f6f6;
  border: 1px solid rgba(0, 0, 0, 0.21);
}
/*
滚动条空白处的样式
*/
.tui-image-editor-menu-mask ::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 5px;
}
</style>
