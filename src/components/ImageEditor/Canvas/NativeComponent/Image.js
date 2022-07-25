import EventEmitter from 'eventemitter3'

class Image {
    backgroundImg = null;
    src = null;
    left = 0;
    top = 0;
    width = 0;
    height = 0;
    zIndex = 0;
    element = null;

    /**
     * 事件系统
     *
     * @type {EventEmitter<string | symbol, any>}
     */
    event = new EventEmitter();

    constructor(attr) {
        this.backgroundImg = attr.backgroundImg || null;
        this.src = attr.src || null;
        this.left = attr.left || 0;
        this.top = attr.top || 0;
        this.width = attr.width || 0;
        this.height = attr.height || 0;
        this.zIndex = attr.zIndex || 0;

        const element = document.createElement("img");

        element.style.position = "absolute";
        element.style.left = this.left + "px";
        element.style.top = this.top + "px";
        element.style.width = this.width + 'px';
        element.style.height = this.height + 'px';
        element.style.zIndex = this.zIndex + '';
        element.src = this.backgroundImg;

        element.onload = () => this.onLoad(element);
        element.addEventListener("dragstart", this.onDragStart);
        element.addEventListener("selectstart", this.onSelectStart);

        this.element = element;
        this.element.style.userSelect = 'none';
    }

    onLoad(element) {
        this.event.emit("load", { width: element.width, height: element.height });
    }

    onDragStart(e) {
        e.preventDefault();
    }

    onSelectStart(e) {
        e.preventDefault();
    }
}

export default Image;
