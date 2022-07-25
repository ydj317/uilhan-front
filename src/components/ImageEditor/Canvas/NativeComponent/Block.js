import EventEmitter from "eventemitter3";

class Block {
    backgroundColor = "transparent";
    left = 0;
    top = 0;
    width = 0;
    height = 0;
    zIndex = 0;

    /**
     * 当前元素
     *
     * @type HTMLDivElement
     */
    element = null;

    /**
     * 事件管理器
     *
     * @type {EventEmitter<string | symbol, any>}
     */
    event = new EventEmitter();

    isActive = false;

    dragInfo = {
        isDragStart: false,
        isDragging: false,
        initMouseX: 0,
        initMouseY: 0,
        initElementX: 0,
        initElementY: 0
    };

    resizeInfo = {
        isResizeStart: false,
        isResizing: false,
        initMouseX: 0,
        initMouseY: 0,
        initElementWidth: 0,
        initElementHeight: 0
    };

    tempZIndex = null;

    /**
     * 拖动句柄
     *
     * @type HTMLDivElement
     */
     resizeHandle = null;

    constructor(attr) {
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.outline = 'none';

        this.setBackgroundColor(attr.backgroundColor);
        this.setLeft(attr.left);
        this.setTop(attr.top);
        this.setWidth(attr.width);
        this.setHeight(attr.height);
        this.setZIndex(attr.zIndex);

        document.addEventListener("mousedown", e => this.onMouseDown(e));
        document.addEventListener("mousemove", e => this.onMouseMove(e));
        document.addEventListener("mouseup", e => this.onMouseUp(e));
        document.addEventListener("click", e => this.onClickOutside(e));

        this.resizeHandle = document.createElement("div");
        this.resizeHandle.style.position = "absolute";
        this.resizeHandle.style.width = "11px";
        this.resizeHandle.style.height = "11px";
        this.resizeHandle.style.right = "-6px";
        this.resizeHandle.style.bottom = "-6px";
        this.resizeHandle.style.cursor = "se-resize";
        this.resizeHandle.style.display = "none";
        this.element.append(this.resizeHandle);
    }

    onMouseDown(e) {
        if (e.target === this.element) {
            this.dragInfo.isDragStart = true;
            this.dragInfo.initMouseX = e.screenX;
            this.dragInfo.initMouseY = e.screenY;
            this.dragInfo.initElementX = this.getLeft();
            this.dragInfo.initElementY = this.getTop();

            if (!this.isActive) {
                this.select();
            }
        }

        if (e.target === this.resizeHandle) {
            this.resizeInfo.isResizeStart = true;
            this.resizeInfo.initMouseX = e.screenX;
            this.resizeInfo.initMouseY = e.screenY;
            this.resizeInfo.initElementWidth = this.getWidth();
            this.resizeInfo.initElementHeight = this.getHeight();
        }
    }

    onMouseMove(e) {
        if (this.dragInfo.isDragStart && !this.dragInfo.isDragging) {
            const moveX = Math.abs(e.screenX - this.dragInfo.initMouseX);
            const moveY = Math.abs(e.screenY - this.dragInfo.initMouseY);
            if (moveX > 6 || moveY > 6) {
                this.dragInfo.isDragging = true;
            }
        }

        if (this.dragInfo.isDragging) {
            this.setLeft(this.dragInfo.initElementX + e.screenX - this.dragInfo.initMouseX);
            this.setTop(this.dragInfo.initElementY + e.screenY - this.dragInfo.initMouseY);
        }

        if (this.resizeInfo.isResizeStart && !this.resizeInfo.isResizing) {
            this.resizeInfo.isResizing = true;
        }

        if (this.resizeInfo.isResizing) {
            this.setWidth(this.resizeInfo.initElementWidth + e.screenX - this.resizeInfo.initMouseX);
            this.setHeight(this.resizeInfo.initElementHeight + e.screenY - this.resizeInfo.initMouseY);
        }
    }

    onMouseUp() {
        if (this.dragInfo.isDragging) {
            this.dragInfo.isDragging = false;
            this.event.emit("move", this, {left: this.getLeft(), top: this.getTop()});
        }

        this.dragInfo.isDragStart = false;

        if (this.resizeInfo.isResizing) {
            this.resizeInfo.isResizing = false;
            this.event.emit("resize", this, {width: this.getWidth(), height: this.getHeight()});
        }

        this.resizeInfo.isResizeStart = false;
    }

    onClickOutside(e) {
        if (e.target === this.resizeHandle) {
            e.stopPropagation();
            return;
        }

        if (e.target !== this.element && this.isElementInCanvas(e.target) && this.isActive) {
            this.unselect();
        }
    }

    isElementInCanvas(element) {
        while (element !== document.body && element !== null) {
            if (element.className === "canvas") {
                return true;
            }
            element = element.parentNode;
        }

        return false;
    }

    select() {
        this.isActive = true;
        this.event.emit("select", this);
        this.element.style.border = "1px dotted gray";
        this.element.style.cursor = "default";
        this.resizeHandle.style.display = "block";

        this.tempZIndex = this.getZIndex();
        this.setZIndex(999);
    }

    unselect() {
        this.isActive = false;
        this.event.emit("unselect", this);
        this.element.style.border = "0";
        this.resizeHandle.style.display = "none";

        this.setZIndex(this.tempZIndex);
    }

    //--------------------------------------------------------------------
    // GET, SET
    //--------------------------------------------------------------------

    getBackgroundColor() {
        return this.backgroundColor;
    }

    setBackgroundColor(backgroundColor) {
        this.backgroundColor = backgroundColor || "transparent";
        this.element.style.backgroundColor = this.backgroundColor;
    }

    getLeft() {
        return this.left;
    }

    setLeft(left) {
        this.left = left !== undefined ? parseInt(left) : 0;
        this.element.style.left = this.left + "px";
    }

    getTop() {
        return this.top;
    }

    setTop(top) {
        this.top = top !== undefined ? parseInt(top) : 0;
        this.element.style.top = this.top + "px";
    }

    getWidth() {
        return this.width;
    }

    setWidth(width) {
        this.width = width !== undefined ? parseInt(width) : 0;
        this.element.style.width = this.width + "px";
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        this.height = height !== undefined ? parseInt(height) : 0;
        this.element.style.height = this.height + "px";
    }

    getZIndex() {
        return this.zIndex;
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex !== undefined ? parseInt(zIndex) : 0;
        this.element.style.zIndex = this.zIndex + '';
    }
}

export default Block;
