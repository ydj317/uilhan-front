import Image from './Image'
import Text from './Text'
import Block from './Block'
import Buffer from './Buffer'

class Canvas {
    /**
     * 当前画布的父元素
     *
     * @type HTMLDivElement
     */
    container = null;

    /**
     * 当前画布
     *
     * @type HTMLDivElement
     */
    canvas = null;
    rawData = {};

    /**
     * 事件管理系统
     *
     * @type {EventEmitter<string | symbol, any>}
     */
    event;

    /**
     * 画面中的元素
     *
     * @type {[Image|Text|Block]}
     */
    children = [];

    /**
     * 被选中的文本
     * @type {Text}
     */
    selectedElement = null;

    constructor(container, event) {
        this.container = container;
        this.canvas = document.createElement("div");
        this.canvas.style.position = "relative";
        this.canvas.style.width = "0";
        this.canvas.style.height = "0";
        this.canvas.style.overflow = "hidden";
        this.container.appendChild(this.canvas);

        this.event = event;
        this.event.on("layout_update", this.onLayoutUpdate);
        this.event.on("translated_text_update", this.onTranslatedTextUpdate);
        this.event.on("font_update", this.onFontUpdate);
        this.event.on("unselect", this.onUnselect);
        this.event.on("append_text", this.onTextAppend);
        this.event.on("append_block", this.onBlockAppend);

        document.addEventListener("keydown", this.onKeydown);
    }

    onImageLoaded = ({ width, height }) => {
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
    };

    onUnselect = () => {
        if (this.selectedElement !== null) {
            this.selectedElement.unselect();
        }
    };

    onTextSelected = (target) => {
        if (this.selectedElement !== null && this.selectedElement !== target) {
            this.selectedElement = null;
            this.event.emit("no_element_selected");
        }

        this.selectedElement = target;
        this.event.emit("element_selected", target);
    };

    onTextUnSelected = (target) => {
        if (target === this.selectedElement) {
            this.selectedElement = null;
            this.event.emit("no_element_selected");
        }
    };

    onTextMoved = (target) => {
        this.event.emit("layout_update", {
            from: "canvas",
            left: target.getLeft(),
            top: target.getTop(),
            width: target.getWidth(),
            height: target.getHeight()
        });
    };

    onTextResized = (target) => {
        this.event.emit("layout_update", {
            from: "canvas",
            left: target.getLeft(),
            top: target.getTop(),
            width: target.getWidth(),
            height: target.getHeight()
        });
    };

    onLayoutUpdate = ({ from, left, top, width, height, backgroundColor }) => {
        if (from !== 'panel' || this.selectedElement === null) {
            return;
        }

        this.selectedElement.setLeft(left);
        this.selectedElement.setTop(top);
        this.selectedElement.setWidth(width);
        this.selectedElement.setHeight(height);
        this.selectedElement.setBackgroundColor(backgroundColor);
    };

    onTranslatedTextUpdate = ({ from, translatedText }) => {
        if (from !== 'panel' || this.selectedElement === null) {
            return;
        }

        this.selectedElement.setTranslatedText(translatedText);
    };

    onFontUpdate = ({ from, fontFamily, fontSize, lineHeight, textAlign, fontWeight, fontStyle, color }) => {
        if (from !== 'panel' || this.selectedElement === null) {
            return;
        }

        this.selectedElement.setFontFamily(fontFamily);
        this.selectedElement.setFontSize(fontSize);
        this.selectedElement.setLineHeight(lineHeight);
        this.selectedElement.setTextAlign(textAlign);
        this.selectedElement.setFontWeight(fontWeight);
        this.selectedElement.setFontStyle(fontStyle);
        this.selectedElement.setColor(color);
    };

    onKeydown = (e) => {
        if (this.selectedElement !== null && e.key === 'Delete') {
            this.children = this.children.filter(child => child !== this.selectedElement);
            this.canvas.removeChild(this.selectedElement.element);
            this.selectedElement = null;
            this.event.emit("no_element_selected");
        }
    };

    onTextAppend = () => {
        const buffer = new Buffer(this.canvas, this.canvas.style.width, this.canvas.style.height);

        buffer.onDone(rect => {
            if (rect === null) {
                this.event.emit("inactive_text_append");
                return;
            }

            let zIndex = 1;
            this.children.forEach(element => {
                if (element.getZIndex !== undefined && element.getZIndex() > zIndex) {
                    zIndex = element.getZIndex();
                }
            });

            let text = new Text({
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
                fontSize: 15,
                lineHeight: 15,
                zIndex: zIndex + 1,
                ocrContent: '新文本',
                content: 'New Text'
            });

            text.event.on("select", this.onTextSelected);
            text.event.on("unselect", this.onTextUnSelected);
            text.event.on("move", this.onTextMoved);
            text.event.on("resize", this.onTextResized);

            this.children.push(text);
            this.canvas.appendChild(text.element);

            if (this.selectedElement !== null) {
                this.selectedElement.unselect();
            }

            text.select();
            this.event.emit("inactive_text_append");
        });
    };

    onBlockAppend = () => {
        const buffer = new Buffer(this.canvas, this.canvas.style.width, this.canvas.style.height);

        buffer.onDone(rect => {
            if (rect === null) {
                this.event.emit("inactive_block_append");
                return;
            }

            let block = new Block({
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
                zIndex: 2
            });

            block.event.on("select", this.onTextSelected);
            block.event.on("unselect", this.onTextUnSelected);
            block.event.on("move", this.onTextMoved);
            block.event.on("resize", this.onTextResized);

            this.children.push(block);
            this.canvas.appendChild(block.element);

            if (this.selectedElement !== null) {
                this.selectedElement.unselect();
            }

            block.select();
            this.event.emit("inactive_block_append");
        });
    };

    load(data) {
        this.rawData = data;
        this.children = [];
        this.canvas.innerHTML = '';
        this.selectedElement = null;
        this.event.emit("no_element_selected");

        if (data["children"] !== undefined && Array.isArray(data["children"])) {
            data["children"].forEach(item => {
                if (item.type === "image") {
                    let image = new Image(item);
                    image.event.on("load", this.onImageLoaded);
                    this.children.push(image);
                    this.canvas.appendChild(image.element);
                } else if (item.type === 'text' && item.content === '') {
                    let block = new Block(item);
                    block.event.on("select", this.onTextSelected);
                    block.event.on("unselect", this.onTextUnSelected);
                    block.event.on("move", this.onTextMoved);
                    block.event.on("resize", this.onTextResized);
                    this.children.push(block);
                    this.canvas.appendChild(block.element);
                } else if (item.type === 'text') {
                    let text = new Text(item);
                    text.event.on("select", this.onTextSelected);
                    text.event.on("unselect", this.onTextUnSelected);
                    text.event.on("move", this.onTextMoved);
                    text.event.on("resize", this.onTextResized);
                    this.children.push(text);
                    this.canvas.appendChild(text.element);
                }
            });
        }
    }
}

export default Canvas;
