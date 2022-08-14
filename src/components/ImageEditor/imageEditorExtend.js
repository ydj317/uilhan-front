export class ImageEditorExtend {
  static isHideFunction = true;
  static customCrop = false;
  static aActiveObjectIds = [];
  static imageEditor;
  static font = [];
  static invoke = {
    uploadIcon: (oMockIcons) => {
      this.uploadIcon(oMockIcons);
    },
    loadImage: (sImageUrl) => {
      this.loadImage(sImageUrl);
    },
    toDataURL: () => {
      return this.imageEditor.toDataURL({
        format: 'png'
      });
    },
  };

  static instance() {
    this.smartDesign();
    this.initEl();
    this.initFile();
    this.setFontFamilyHtml();
    this.setFontFamily();
    this.setBgColorHtml();
    this.setBgColor();
    this.activeBgColor("#ffffff");
    this.setCropSizeHtml();

    this.hideFunction();

    return this;
  }

  static smartDesign() {
    setTimeout(()=> {
      _$(".imageEditorApp").css({
        width: _$(".imageEditorApp ").parent().width() + 'px',
      });
      _$('.newImageEditorList').css({
        width: _$(".imageEditorApp ").width() + 'px',
      });
      _$('.newImageEditorList img:first').css({
        border: '10px inset red',
      });
    })
    _$(window).resize(function () {
      _$(".imageEditorApp").css({
        width: _$(".imageEditorApp ").parent().width() + 'px',
      });
      _$('.tui-image-editor-menu-mask .tui-image-editor-submenu-item').css({
        width: _$(".imageEditorApp ").width() + 'px',
      });
      _$('.newImageEditorList').css({
        width: _$(".imageEditorApp ").width() + 'px',
      });
    })
    _$('.newImageEditorList').delegate('img', 'click', function () {
      _$('.newImageEditorList img').css({
        border: 'none'
      })
      _$(this).css({
        border: '10px inset red',
      });
    })
  }

  static hideFunction() {
    if (this.isHideFunction === true) {
      document.querySelector(".tie-btn-resize")["style"].display = "none";
      document.querySelector(".customCropSizeContainer")["style"].display = "none";
    }
  }

  static onAddText() {
    let iActiveObjectId = this.imageEditor.activeObjectId;

    // BG-Color
    let oBgColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="BackGroundColor"]'
    );
    let sBgColor = oBgColor.querySelector(".tui-colorpicker-palette-hex").value;
    this.activeBgColor(sBgColor);

    // Font-family
    let sFontFamily = document.querySelector(".font-selector")["value"];
    setTimeout(() => {
      this.imageEditor.setObjectProperties(iActiveObjectId, {
        backgroundColor: sBgColor,
        fontFamily: sFontFamily,
      });
      this.aActiveObjectIds.push(iActiveObjectId);
    });
  }

  static onObjectActivated(e) {
    if (
      e.type === "i-text" &&
      this.aActiveObjectIds.includes(Number(e.id)) === true
    ) {
      // BG-Color
      let aProp = this.imageEditor.getObjectProperties(
        Number(e.id),
        "backgroundColor"
      );
      let sBgColor = aProp.backgroundColor;
      this.activeBgColor(sBgColor);

      // Font-family
      aProp = this.imageEditor.getObjectProperties(Number(e.id), "fontFamily");
      let sFontFamily = aProp.fontFamily;

      setTimeout(() => {
        this.imageEditor.setObjectProperties(Number(e.id), {
          backgroundColor: sBgColor,
          fontFamily: sFontFamily,
        });
      });
    }
  }

  static onObjectScaled(e) {
    if (e.type === "cropzone") {
      document
        .querySelector(".customCropWidthVal")
        .setAttribute("placeholder", e.width);
      document
        .querySelector(".customCropHeightVal")
        .setAttribute("placeholder", e.height);
    }
  }

  static onSelectionCreated(e) {
    if (e.type === "cropzone") {
      if (this.customCrop === true) {
        let iMaxWidth = e.canvas.width;
        let iMaxHeight = e.canvas.height;
        let iWidth = parseInt(
          document.querySelector(".customCropWidthVal")["placeholder"]
        );
        let iHeight = parseInt(
          document.querySelector(".customCropHeightVal")["placeholder"]
        );
        if (iWidth > iMaxWidth) {
          iWidth = iMaxWidth;
        }
        if (iWidth < 0 || !iWidth) {
          iWidth = 0;
        }
        if (iHeight > iMaxHeight) {
          iHeight = iMaxHeight;
        }
        if (iHeight < 0 || !iHeight) {
          iHeight = 0;
        }

        let oImageSize = this.imageEditor["editorInstance"]["ui"]["imageSize"];

        e.left = (oImageSize["newWidth"] - iWidth) / 2;
        e.top = (oImageSize["newHeight"] - iHeight) / 2;
        e.width = iWidth;
        e.height = iHeight;
        delete e["presetRatio"]; // 删除这个属性为了自由拉伸
        this.customCrop = false;
      }
      document
        .querySelector(".customCropWidthVal")
        .setAttribute("placeholder", e["width"]);
      document
        .querySelector(".customCropHeightVal")
        .setAttribute("placeholder", e["height"]);
    }
  }

  static loadImage(sImageUrl) {
    setTimeout(() => {
      this.imageEditor.resetZoom();
      console.log('sImageUrl', sImageUrl);
      this.imageEditor.loadImageFromURL(sImageUrl, "image").then((e) => {
//        let oCanvasSize = this.imageEditor.getCanvasSize();
//        setTimeout(() => {
//          this.imageEditor.resizeCanvasDimension({
//            width: 700,
//            height: 700,
//          })
//        })
//        console.debug('this.imageEditor', this.imageEditor)
//        console.debug('oCanvasSize', oCanvasSize)
      });
    });
  }

  static initEl() {
    _$(".tie-mask-apply.tui-image-editor-newline.apply").remove();
    _$(".tui-image-editor-header-logo").remove();
    _$(".tui-image-editor-header-buttons").remove();
    _$(".tui-image-editor-menu-mask li").remove();
  }

  static initFile() {
    let aFontFace = require["context"]("../../../public/static/fontFace", false, /.ttf$/).keys();
    aFontFace.map((sFontFacePath) => {
      this.font.push(sFontFacePath.substr(2, sFontFacePath.length - 6));
    });
  }

  static setFontFamily() {
    let self = this;

    _$(".font-selector").on("change", ()=>{
      let sStyle = _$(".font-selector").val();
      let iActiveObjectId = this.imageEditor.activeObjectId;
      if (iActiveObjectId === null) {
        return;
      }
      setTimeout(() => {
        this.imageEditor.changeTextStyle(Number(iActiveObjectId), {
          fontFamily: sStyle,
        });
      });
    })
  }

  static setFontFamilyHtml() {
    let fontSelectHTML = "";
    this.font.map((sFontName) => {
      fontSelectHTML += `<option style="font-family: ${sFontName};" value="${sFontName}">${sFontName}</option>`;
    });
    let textMenuAlign = document.querySelector(
      ".tie-text-range-value.tui-image-editor-range-value"
    );
    fontSelectHTML =
      '<select class="form-select font-selector" style="background-color: black; color: gray; margin-left: 15px;">' +
      '<option selected="selected">Text style</option>' +
      fontSelectHTML +
      "</select>";
    textMenuAlign.insertAdjacentHTML("afterend", fontSelectHTML);
  }

  static setBgColor() {
    let oThis = this;
    let oColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="Color"]'
    );
    let oBgColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="BackGroundColor"]'
    );
    let oColorPickerControl = oBgColor.querySelector(".color-picker-control");

    document.querySelector(".imageEditorApp").addEventListener("click", (e) => {
      let aClassName = Object.values(e.target["classList"]);

      // 设置 BG-Color
      if (
        aClassName.includes("color-picker-value") === true &&
        e.target["parentNode"].title === "BackGroundColor"
      ) {
        if (oColorPickerControl.style.display === "block") {
          oColorPickerControl.style.display = "none";
        } else if (oColorPickerControl.style.display !== "block") {
          oColorPickerControl.style.display = "block";
          oColorPickerControl.style.top = "-116px";
          oColorPickerControl.style.left = "-67px";
        }

        return;
      }

      // 手动输入 BG-Color
      if (aClassName.includes("tui-colorpicker-palette-hex") === true) {
        oBgColor.querySelector(".color-picker-control").style.display = "block";
        return;
      }

      oColorPickerControl.style.display = "none";
    });

    // 点击 Color 按钮时 隐藏 BG-Color 取色器
    oColor
      .querySelector(".color-picker-value")
      .addEventListener("click", () => {
        oColorPickerControl.style.display = "none";
      });

    Object.values(
      oBgColor.querySelectorAll(".tui-colorpicker-palette-button")
    ).map(function (oEl) {
      oEl.addEventListener("click", function () {
        oBgColor.querySelector(".color-picker-value").className =
          "color-picker-value";
        oBgColor.querySelector(".color-picker-value").style.backgroundColor =
          this.value;
        oBgColor.querySelector(".tui-colorpicker-palette-hex").value =
          this.value;
        oBgColor.querySelector(
          ".tui-colorpicker-palette-preview"
        ).style.backgroundColor = this.value;
        oBgColor.querySelector(".tui-colorpicker-palette-preview").style.color =
          this.value;
        oBgColor.querySelector(".tui-colorpicker-palette-preview").innerHTML =
          this.value;

        // bg-color
        let iActiveObjectId = oThis.imageEditor.activeObjectId;
        // 第一个 模块不存在 背景色
        if (iActiveObjectId !== null) {
          oThis.imageEditor.setObjectProperties(iActiveObjectId, {
            backgroundColor: this.value,
          });
        }
      });
    });

    // BG-Color 去色板 去掉背景色
    oBgColor
      .querySelector(".tui-colorpicker-color-transparent")
      .addEventListener("click", function () {
        oBgColor.querySelector(".color-picker-value").className =
          "color-picker-value transparent";
      });

    // 手动 添加颜色
    oBgColor
      .querySelector(".tui-colorpicker-palette-hex")
      .addEventListener("change", function () {
        let iReg = this.value.search(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

        // 无模块
        let iActiveObjectId = oThis.imageEditor.activeObjectId;
        if (iActiveObjectId === null) {
          oBgColor.querySelector(".tui-colorpicker-palette-hex").value =
            "#ffffff";
          return;
        }

        // 判断颜色值 是否正确 不正确 保持元数据
        if (iReg === -1) {
          let aProp = oThis.imageEditor.invoke(
            "getObjectProperties",
            Number(iActiveObjectId),
            "backgroundColor"
          );
          oBgColor.querySelector(".tui-colorpicker-palette-hex").value =
            aProp.backgroundColor;
          return;
        }
        oThis.imageEditor.setObjectProperties(iActiveObjectId, {
          backgroundColor: this.value,
        });
        oThis.activeBgColor(this.value);
      });
  }

  static setBgColorHtml() {
    let oColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="Color"]'
    );
    let sHtml =
      '<div class="tie-text-color tui-image-editor-button" title="BackGroundColor">' +
      oColor.innerHTML +
      "</div>";
    oColor.insertAdjacentHTML("afterend", sHtml);
    let oBgColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="BackGroundColor"]'
    );
    oBgColor.querySelector("label").innerHTML = "BG-Color";
  }

  static activeBgColor(sBgColor) {
    let oBgColor = document.querySelector(
      '[class="tie-text-color tui-image-editor-button"][title="BackGroundColor"]'
    );
    oBgColor.querySelector(".color-picker-value").style.backgroundColor =
      sBgColor;
    oBgColor.querySelector(".tui-colorpicker-palette-hex").value = sBgColor;
    oBgColor.querySelector(
      ".tui-colorpicker-palette-preview"
    ).style.backgroundColor = sBgColor;
    oBgColor.querySelector(".tui-colorpicker-palette-preview").style.color =
      sBgColor;
    oBgColor.querySelector(".tui-colorpicker-palette-preview").innerHTML =
      sBgColor;

    oBgColor.querySelector(".color-picker-value").className =
      "color-picker-value";
    if (sBgColor === "") {
      oBgColor.querySelector(".color-picker-value").className =
        "color-picker-value transparent";
    }
  }

  static uploadIcon(oMockIcons) {
    let self = this;

    if (_$.isArray(oMockIcons) === false || _$.isEmptyObject(oMockIcons) === true) {
      return false;
    }

    let oMaskItem = document.querySelector('.tui-image-editor-menu-mask .tui-image-editor-submenu-item');
    if (oMaskItem.innerHTML.trim() !== '') {
      return false;
    }

    oMockIcons.map((oImageInfo, index) => {
      let sImageUrl = oImageInfo.src;
      let sHtml = '';
      sHtml += `<li style="border: 1px solid gray;">`;
      sHtml += `<img class="customIcon_${index}" crossorigin="anonymous" style="width: 100px;height: 100px;" alt="" src="${sImageUrl}">`;
      sHtml += `</li>`;

      oMaskItem.insertAdjacentHTML('afterbegin', sHtml);
      oMaskItem['style'].width = _$(".imageEditorApp ").width() + 'px';
      oMaskItem['style'].overflowX = 'scroll';

      document.querySelector(`.customIcon_${index}`).addEventListener('click', function() {
        setTimeout(() => {
          self.imageEditor.addImageObject(this.src);
        });
      });
    });
  }

  //    static getBase64(url, callback, outputFormat){
  //        const img = new Image()
  //        img.crossOrigin = 'Anonymous' // canvas 不能处理跨域图片，如果要处理，除了服务端要开启跨域外，执行canvas操作前也要开启跨域
  //        img.onload = function() {
  //            let canvas = document.createElement('canvas')
  //            const ctx = canvas.getContext('2d')
  //            let dataURL = ''
  //            canvas.height = this.height
  //            canvas.width = this.width
  //            ctx.drawImage(this, 0, 0)
  //            dataURL = canvas.toDataURL(outputFormat)
  //            callback(dataURL)
  //            canvas = null
  //        }
  //        img.onerror = function(e) {
  //            console.log(e)
  //        }
  //        img.src = url
  //    }

  static setCropSizeHtml() {
    let oThis = this;
    let sHtml = `
            <div class="customCropSizeContainer">
                <span class="customCropWidthContainer" style="margin-right: 20px;">
                    <label class="customCropWidth">
                        <span style="color: gray;">W: </span>
                        <input type="text" class="customCropWidthVal" style="width: 40px; background-color: black; color: white" placeholder="0">
                    </label>
                </span>
                <span class="customCropHeightContainer">
                    <label class="customCropWidth">
                        <span style="color: gray;">H: </span>
                        <input type="text" class="customCropHeightVal" style="width: 40px; background-color: black; color: white" placeholder="0">
                    </label>
                </span>
            </div>
`;
    document
      .querySelector(".tui-image-editor-menu-crop .tie-crop-preset-button")
      .insertAdjacentHTML("beforeend", sHtml);

    document
      .querySelector(".customCropWidthVal")
      .addEventListener("change", function () {
        let iWidth = this.value;
        let iHeight = parseInt(
          document.querySelector(".customCropHeightVal")["placeholder"]
        );
        document.querySelector(".customCropWidthVal").placeholder = iWidth;
        document.querySelector(".customCropWidthVal").value = "";
        oThis.customCrop = true;
        oThis.imageEditor.setCropzoneRect(iWidth / iHeight);
      });
    document
      .querySelector(".customCropHeightVal")
      .addEventListener("change", function () {
        let iHeight = this.value;
        let iWidth = parseInt(
          document.querySelector(".customCropWidthVal")["placeholder"]
        );
        document.querySelector(".customCropHeightVal").placeholder = iHeight;
        document.querySelector(".customCropHeightVal").value = "";
        oThis.customCrop = true;
        oThis.imageEditor.setCropzoneRect(iWidth / iHeight);
      });
  }

  //    static _setFontFamilyCss(aFontFace) {
  //        let sCss = '';
  //        aFontFace.map(sFontFacePath => {
  //            sCss += `@font-face {\n`;
  //            sCss += `   font-family: ${sFontFacePath.substr(2, sFontFacePath.length - 6)};\n`;
  //            sCss += `   src: url('../fontFace/${sFontFacePath.substr(2)}');\n`;
  //            sCss += `}\n`;
  //        });
  //
  //        console.log('css', {'css': sCss});
  //        document.querySelector('head').insertAdjacentHTML('afterbegin', `<style>${sCss}</style>`);
  //
  //        return sCss;
  //    }
}
