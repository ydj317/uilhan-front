class Buffer {
    /**
     * 父元素
     *
     * @type HTMLDivElement
     */
    parentNode = null;

    /**
     * 当前元素
     *
     * @type HTMLDivElement
     */
    element = null;

    /**
     * 正方形元素
     *
     * @type HTMLDivElement
     */
    rectElement = null;

    initPoint = { x: 0, y: 0 };

    /**
     * 选择范围后调用
     * 
     * @type Function
     */
    callback = () => undefined;

    constructor(parentNode, width, height) {
        this.parentNode = parentNode;

        const element = document.createElement("div");
        element.style.width = width;
        element.style.height = height;
        element.style.position = "absolute";
        element.style.left = "0px";
        element.style.right = "0px";
        element.style.top = "0px";
        element.style.bottom = "0px";
        element.style.zIndex = "999999";
        element.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        element.style.cursor = "crosshair";

        element.addEventListener("mousedown", this.onMouseDown);
        element.addEventListener("mousemove", this.onMouseMove);
        element.addEventListener("mouseup", this.onMouseUp);

        this.parentNode.appendChild(element);
        this.element = element;

        setTimeout(() => {
            document.addEventListener("mousedown", (e) => {
                if (e.target !== this.element) {
                    this.callback(null);
                    this.destroy();
                    return;
                }
            });
        }, 0);
    }

    onMouseDown = (e) => {
        this.rectElement = document.createElement("div");
        this.rectElement.style.width = "0px";
        this.rectElement.style.height = "0px";
        this.rectElement.style.position = "absolute";
        this.rectElement.style.left = e.offsetX + "px";
        this.rectElement.style.top = e.offsetY + "px";
        this.rectElement.style.border = "1px solid #0078d7";
        this.rectElement.style.backgroundColor = "rgba(0, 120, 215, 0.1)";
        this.element.appendChild(this.rectElement);

        this.initPoint = {
            x: e.offsetX,
            y: e.offsetY,
            screenX: e.screenX,
            screenY: e.screenY
        };
    };

    onMouseMove = (e) => {
        if (this.rectElement === null) {
            return;
        }

        const rect = this.getRect(e);

        this.rectElement.style.left = rect.x + "px";
        this.rectElement.style.top = rect.y + "px";
        this.rectElement.style.width = rect.width + "px";
        this.rectElement.style.height = rect.height + "px";
    };

    onMouseUp = (e) => {
        const rect = this.getRect(e);

        if (rect.width < 10) {
            rect.width = 10;
        }

        if (rect.height < 10) {
            rect.height = 10;
        }

        this.callback(rect);
        this.destroy();
    };

    getRect(e) {
        const moveX = e.screenX - this.initPoint.screenX;
        const moveY = e.screenY - this.initPoint.screenY;

        const rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        if (moveX > 0) {
            rect.x = this.initPoint.x;
            rect.width = moveX;
        } else {
            rect.x = this.initPoint.x + moveX;
            rect.width = -moveX;
        }

        if (moveY > 0) {
            rect.y = this.initPoint.y;
            rect.height = moveY;
        } else {
            rect.y = this.initPoint.y + moveY;
            rect.height = -moveY;
        }

        return rect;
    }

    onDone(callback) {
        if (typeof callback === "function") {
            this.callback = callback;
        }
    }

    destroy() {
        this.element.removeEventListener("mousedown", this.onMouseDown);
        this.element.removeEventListener("mousemove", this.onMouseMove);
        this.element.removeEventListener("mouseup", this.onMouseUp);
        this.parentNode.removeChild(this.element);
    }
}

export default Buffer;