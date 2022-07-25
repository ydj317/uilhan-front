import Block from './Block'

class Text extends Block {
    color = "black";
    fontFamily = "sans-serif";
    fontSize = 12;
    letterSpacing = 0;
    lineHeight = 0;
    textAlign = "left";
    fontWeight = 'normal';
    fontStyle = 'normal';

    originalText = '';
    translatedText = '';

    constructor(attr) {
        super(attr);

        this.textElement = document.createElement("div");
        this.textElement.style.position = "absolute";
        this.textElement.style.left = "0";
        this.textElement.style.right = "0";
        this.textElement.style.bottom = "0";
        this.textElement.style.top = "0";
        this.textElement.style.userSelect = 'none';
        this.element.appendChild(this.textElement);

        this.setColor(attr.color);
        this.setFontFamily(attr.fontFamily);
        this.setFontSize(attr.fontSize);
        this.setLetterSpacing(attr.letterSpacing);
        this.setLineHeight(attr.lineHeight);
        this.setTextAlign(attr.textAlign);
        this.setFontWeight(attr.fontWeight);
        this.setFontStyle(attr.fontStyle);
        this.setOriginalText(attr.ocrContent);
        this.setTranslatedText(attr.content);
    }

    onMouseDown(e) {
        if (e.target === this.textElement) {
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

    onClickOutside(e) {
        if (e.target === this.resizeHandle) {
            e.stopPropagation();
            return;
        }

        if (e.target !== this.textElement && this.isElementInCanvas(e.target) && this.isActive) {
            this.unselect();
        }
    }

    select() {
        this.isActive = true;
        this.event.emit("select", this);
        this.textElement.style.border = "1px dotted gray";
        this.textElement.style.cursor = "default";
        this.resizeHandle.style.display = "block";

        this.tempZIndex = this.getZIndex();
        this.setZIndex(999);
    }

    unselect() {
        this.isActive = false;
        this.event.emit("unselect", this);
        this.textElement.style.border = "0";
        this.resizeHandle.style.display = "none";

        this.setZIndex(this.tempZIndex);
    }

    //--------------------------------------------------------------------
    // GET, SET
    //--------------------------------------------------------------------

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color || "black";
        this.textElement.style.color = this.color;
    }

    getFontFamily() {
        return this.fontFamily;
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily || "sans-serif";
        this.textElement.style.fontFamily = this.fontFamily;
    }

    getFontSize() {
        return this.fontSize;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize !== undefined ? parseInt(fontSize) : 12;
        this.textElement.style.fontSize = this.fontSize + 'px';
    }

    getLetterSpacing() {
        return this.letterSpacing;
    }

    setLetterSpacing(letterSpacing) {
        this.letterSpacing = letterSpacing !== undefined ? parseInt(letterSpacing) : "normal";

        if (this.letterSpacing === "normal") {
            this.textElement.style.letterSpacing = "normal";
        } else {
            this.textElement.style.letterSpacing = this.letterSpacing + "px";
        }
    }

    getLineHeight() {
        return this.lineHeight;
    }

    setLineHeight(lineHeight) {
        this.lineHeight = lineHeight !== undefined ? parseInt(lineHeight) : "normal";

        if (this.lineHeight === "normal") {
            this.textElement.style.lineHeight = "normal";
        } else {
            this.textElement.style.lineHeight = this.lineHeight + "px";
        }
    }

    getTextAlign() {
        return this.textAlign;
    }

    setTextAlign(textAlign) {
        this.textAlign = textAlign || "left";
        this.textElement.style.textAlign = this.textAlign;
    }

    getFontWeight() {
        return this.fontWeight;
    }

    setFontWeight(fontWeight) {
        this.fontWeight = fontWeight === 'bold' ? 'bold' : 'normal';
        this.textElement.style.fontWeight = this.fontWeight;
    }

    getFontStyle() {
        return this.fontStyle;
    }

    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle === 'italic' ? 'italic' : 'normal';
        this.textElement.style.fontStyle = this.fontStyle;
    }

    getOriginalText() {
        return this.originalText;
    }

    setOriginalText(OriginalText) {
        this.originalText = OriginalText || '';
    }

    getTranslatedText() {
        return this.translatedText;
    }

    setTranslatedText(translatedText) {
        this.translatedText = translatedText || '';
        this.textElement.innerText = this.translatedText;
    }
}

export default Text;
