<template>
  <div>
    <loading :active="bLoading" :can-cancel="false" :is-full-page="true"/>
    <!-- a-modal 渲染时 数据处理 同时使用 if 和 visible 请不要删除 -->

    <template title="번역팝업" >
      <a-modal v-if="bImageEditorModule" :visible="bImageEditorModule" @ok="mHandleOkTranslateWindow" @cancel="mCloseTranslateWindow" :title="sModuleTitle" :maskClosable="false" width="60%" >
        <div class="w100 right center"><h3 class="mr50">남은회수: <span class="red">{{recharge}}</span></h3></div>
        <table style="width: 100%; height: 600px;">
          <tbody>
          <tr>
            <th style="height: 30px">
            </th>
            <td>
              <div v-if="bTranslateStatus">
                <a-button @click="mSetOriginalImage" :style="originalBtn">기존</a-button>
                <a-button @click="mSetTranslateImage" :style="translateBtn" style="margin-left: 5px">번역</a-button>
              </div>
            </td>
          </tr>
          <tr>
            <!-- 번역 팝업 이미지 리스트 -->
            <th style="width: 50%; vertical-align:text-top">
              <ul title="편집후" v-if="bImageEdited" style="float: left; list-style: none;padding: 0;height: 100%">
                <li v-for="item in aPhotoCollection.filter(data => data.checked)" style="float: left; border: 2px solid white">
                  <a-tooltip placement="right" :trigger="'click'">
                    <template #title>
                      <!-- 미리보기 -->
                      <div>
                        <img v-if="item.translate_status" width="400" height="500" :data-order="item.order" :src="item.translate_url" alt=""/>
                        <img v-else width="400" height="500" :data-order="item.order" :src="item.original_url" alt=""/>
                      </div>
                    </template>
                    <img v-if="item.translate_status" width="100" height="100" :data-order="item.order" :src="item.translate_url" alt=""/>
                    <img v-else width="100" height="100" :data-order="item.order" :src="item.original_url" alt=""/>
                  </a-tooltip>
                </li>
              </ul>
              <ul title="번역전" v-else-if="!bTranslateStatus" style="float: left; list-style: none;padding: 0;height: 100%">
                <li v-for="(item, index) in aPhotoCollection" style="float: left; border: 2px solid white;">
                  <div style="position: relative; border: 2px solid #d9d9d9">
                    <a-tooltip placement="right" :trigger="'click'">
                      <template #title>
                        <div><img width="400" height="500" :src="item.original_url" alt=""/></div>
                      </template>
                      <img width="100" height="100" :src="item.original_url" alt=""/>
                    </a-tooltip>
                    <a-checkbox v-show="bProductDetailsEditor" v-model:checked="item.checked" style="position: absolute; left: 0; top: -3px; width: 20px; height: 20px;"></a-checkbox>
                  </div>
                </li>
              </ul>
              <ul title="번역후" v-else style="float: left; list-style: none;padding: 0;height: 100%">
                <li
                    @click="setSelectedPictureIndex(item)" :class="`${iSelectedPictureIndex === item.key ? 'checkedEl' : 'checkedNot'} `"
                    v-for="(item, index) in aPhotoCollection.filter(data => data.checked)" style="float: left;"
                >
                  <span @click="mEditorImageError()" class="trans_error" v-if="mEditCompleted(item.translate_url)">실패</span>
                  <span class="trans_success" v-if="item.translate_status">성공</span>
                  <span @click="mTranslateError(item.msg)" class="trans_error" v-else>실패</span>
                  <img v-if="item.translate_status" width="100" height="100" :src="item.translate_url" alt=""/>
                  <img v-else width="100" height="100" :src="item.original_url" alt=""/>
                </li>
              </ul>
            </th>
            <td v-if="!bTranslateStatus" style="width: 50%;border: 1px solid #d9d9d9;padding-left: 50px">
              <!-- 번역 언어 선택 -->
              <a-radio-group v-model:value="toLang" style="position: absolute;top: 150px">
                <a-radio :style="oRadioStyle" value="ko">to Korea</a-radio>
                <a-radio :style="oRadioStyle" value="ja">to Japan</a-radio>
                <a-radio :style="oRadioStyle" value="en">to English</a-radio>
              </a-radio-group>
              <div class="w22 space-between absolute right" style="bottom: 82px; right: 28px;">
                <a-button class="bg-3051d3 mr5" type="primary" v-show="bProductDetailsEditor" @click="mSelectDelImageReverse">전체선택</a-button>
                <a-button class="bg-3051d3 mr5" type="primary" v-show="bProductDetailsEditor" @click="mSelectDelImageReverseAll">선택취소</a-button>
                <a-popconfirm
                    title="번역하시겠습니까?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="mImageTranslate"
                >
                  <a-button class="bg-ff4d4f" style="border: none;" type="primary">번역</a-button>
                </a-popconfirm>
              </div>
            </td>
            <td v-else style="border: 1px solid #d9d9d9; vertical-align: top;">
              <div style="width: calc(3 * 150px); height: calc(4 * 150px); margin: 0 auto;">
                <img style="max-width: calc(3 * 150px); max-height: calc(4 * 150px)" :src="sSelectedPictureLink" alt="">
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <template title="번역팝업 하단버튼" v-slot:footer>
          <a-button class="bg-3051d3" title="번역" v-if="bTranslateStatus" type="primary" @click="mHandleOkTranslateEditorImage">수동편집</a-button>
          <a-button class="bg-3051d3" title="원본" v-else type="primary" @click="mHandleOkOriginalEditorImage">수동편집</a-button>
          <a-button class="bg-3051d3" type="primary" @click="mHandleOkTranslateWindow">확인</a-button>
          <a-button class="bg-3051d3" type="primary" @click="mCloseTranslateWindow">취소</a-button>
        </template>
      </a-modal>
    </template>

    <template title="[원본] 편집기" >
      <a-modal v-if="bOriginalImageEditorModule" :visible="bOriginalImageEditorModule" @ok="mHandleOkOriginalImage" @cancel="mOriginalImageCancel" :maskClosable="false" title="수동편집" width="80%" >
        <div title="이미지 편집기" class="parent-element">
          <imageEditor :data="aPhotoCollection" ref="imageEditor"></imageEditor>
        </div>
        <div style="margin-top: 8px">
          <div class="newImageEditorList" style="height: 192px; overflow-x: auto; overflow-y: hidden; white-space: nowrap;">
            <table style="display: inline-block;" v-for="(item, key) in aPhotoCollection.filter(data => data.checked)">
              <tr>
                <td>
                  <img style="display: block"
                       @click="mSeleteEditorImageType(item.original_url, item.key)"
                       :src="item.original_url"
                       width="120"
                       height="100" alt=""/>
                </td>
              </tr>
              <tr>
                <td><a-button style="width: 120px" @click="mSaveOringinalEditorImage(item.key)">저장</a-button></td>
              </tr>
            </table>
          </div>
        </div>
      </a-modal>
    </template>

    <template title="[번역] 편집기" >
      <a-modal v-if="bTranslateImageEditorModule" :visible="bTranslateImageEditorModule" @ok="mHandleOkTranslateImage" @cancel="mTranslateImageCancel" :maskClosable="false" title="수동편집" width="80%" >
        <div title="이미지 편집기" class="parent-element">
          <imageEditor :data="aPhotoCollection" ref="imageEditor"></imageEditor>
        </div>
        <div style="margin-top: 8px">
          <div class="newImageEditorList" style="height: 192px; overflow-x: auto; overflow-y: hidden;white-space: nowrap;">
            <table style="display: inline-block;" v-for="(item, index) in aPhotoCollection.filter(data => data.checked && data.translate_status)">
              <tr v-if="item.translate_status">
                <td style="width: 120px">
                  <a-button style="float: left; width: 50%" @click="_mSeleteEditorImageType(item.original_url, item.key)">기존</a-button>
                  <a-button style="float: left; width: 50%" @click="_mSeleteEditorImageType(item.translate_url, item.key)">번역</a-button>
                </td>
              </tr>
              <tr v-if="item.translate_status">
                <td>
                  <img style="display: block"
                       @click="mSeleteEditorImageType(item.translate_url, item.key)"
                       :src="item.translate_url"
                       width="120"
                       height="100"  alt=""/>
                </td>
              </tr>
              <tr v-if="item.translate_status">
                <td><a-button style="width: 120px" @click="mSaveTranslateEditorImage(item.key)">저장</a-button></td>
              </tr>
            </table>
          </div>
        </div>
      </a-modal>
    </template>
  </div>
</template>

<script>
import {AuthRequest} from 'util/request';
import ImageEditor from "./imageEditor.vue";
import loading from 'vue-loading-overlay';

export default {
  name: "ImageEditorGroup",
  display: "ImageEditorGroup",

  components: {
    ImageEditor,
    loading
  },

  props: {},

  data() {
    const oRadioStyle = {
      height: '30px',
      display: 'block',
      lineHeight: '30px',
    }

    return {
      oRadioStyle,

      recharge: 0,

      // Status
      bLoading: false,
      bImageEdited: false,
      bTranslateStatus: false,
      bProductDetailsEditor: false,

      // Module
      bImageEditorModule: false,
      bOriginalImageEditorModule: false,
      bTranslateImageEditorModule: false,

      aIcons: [],
      aPhotoCollection: [],
      aBakPhotoCollection: [],
      aEditorImages: [],

      toLang: 'ko',
      sModuleTitle: '', // '이미지 편집', 'SKU 이미지 번역', '상세설명 이미지 번역'
      sSelectedPictureLink: '',

      iProductId: -1,
      iSelectedPictureIndex: 0,

      originalBtn: '',
      translateBtn: '',
    };
  },

  methods: {
    getRecharge() {
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/getrecharge').then((res) => {
        if (res.data === undefined || res.data.status !== '2000') {
          alert('데이터 받기에 실패하였습니다. 오류가 지속될시 관리자에게 문의하시길 바랍니다.');
          return false;
        }

        try {
          this.recharge = res.data.recharge;
        } catch (e) {
          alert('남은회수 호출 실패');
        }

        this.bLoading = false;
      });
    },

    mCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    // 이미지 편집후 변역 불가능 합니다
    mEditorImageError() {
      alert('이미지 편집후 변역 불가능 합니다');
    },

    /**
     * todo server
     */
    // 편집 여부 확인
    mEditCompleted(url) {
      return url.indexOf('https://test.kuaidiair-yuncongcon.com') !== -1 || url.indexOf('https://sym.s') !== -1;
    },

    // 편집기에 이미지 추가
    mLoadImage(url, iMax = 0) {
      setTimeout(() => {
        try {
          window._imageEditor.uploadIcon(this.aIcons);
          window._imageEditor.loadImage(url);
        } catch (e) {
          alert('이미지 편집기에 추가실패');
        }
      })

      return false;

      // if (this.bLoading !== true) {
      //   this.bLoading = true;
      // }
      //
      // setTimeout(() => {
      //   try {
      //     iMax++;
      //     window._imageEditor.uploadIcon(this.aIcons);
      //     window._imageEditor.loadImage(url);
      //     this.bLoading = false;
      //
      //   } catch (e) {
      //
      //     if (iMax > 3) {
      //       this.bLoading = false;
      //       console.log("mLoadImage error", e);
      //       return false;
      //     }
      //
      //     this.mLoadImage(url, iMax);
      //     return false;
      //   }
      // }, 200)
    },

    // 이미지 번역
    mImageTranslate() {
      let aCheckedImage = this.aPhotoCollection.filter(data => data.checked);

      let param = {
        from: 'zh',
        to: this.toLang,
        list: aCheckedImage,
      };

      if (aCheckedImage.length === 0) {
        alert('번역할 이미지를 선택해주세요');
        return false;
      }

      if (this.recharge < 1 || param.list.length > this.recharge) {
        alert('이미지번역 잔여수가 부족합니다.');
        this.bLoading = false;
        return false;
      }

      this.bLoading = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/transimage', param).then((res) => {
        if (res.status === undefined || res.status !== 200) {
          alert('번역 실패. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.');
          this.bLoading = false;
          return false;
        }

      if (res.data['list'] === 0) {
        alert('번역 실패. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.');
        this.bLoading = false;
        return false;
      }

      try {
        this.iSelectedPictureIndex = null;
        res.data['list'].map((aPhoto) => {
          if (this.iSelectedPictureIndex === null && aPhoto.translate_status) {
            this.iSelectedPictureIndex = aPhoto.key;
            this.sSelectedPictureLink = aPhoto.translate_url;
          }

          this.aPhotoCollection.map((data, j) => {
            if (data.key === aPhoto.key) {
              this.aPhotoCollection[ j] = {
                "msg" : aPhoto.msg || '',
                "key" : aPhoto.key, // 필수!!!
                "name": aPhoto.name || '',
                "order": aPhoto.order || '',
                "checked": aPhoto.checked || false,
                "visible": aPhoto.visible || false,
                "original_url" : aPhoto.original_url || '', // 필수!!!
                "translate_url": aPhoto.translate_url || '',
                "translate_status": aPhoto.translate_status || false, // 필수!!!
              };
            }
          })

        })
        this.mSetTranslateImage();
        this.bTranslateStatus = true;
        this.recharge = res.data.recharge;
      } catch (e) {
        this.iSelectedPictureIndex = 0;
        alert('번역 api 호출 실패');
      }

      this.bLoading = false;
      });
    },

    // 수동편집 초기화
    mInitEditorImage(bProductDetailsEditor = false) {
      this.bLoading = false;
      this.bImageEdited = false;
      this.bTranslateStatus = false;
      this.bImageEditorModule = true;
      this.iSelectedPictureIndex = 0;
      this.bProductDetailsEditor = bProductDetailsEditor;

      try {
        this.sSelectedPictureLink = this.aPhotoCollection[0].original_url;
      } catch (e) {}

      this.aPhotoCollection.map((data, i) => {
        this.aPhotoCollection[i].checked = !bProductDetailsEditor;
        if (!data.key) {
          this.aPhotoCollection[i].key = i;
        }
      })

      this.aBakPhotoCollection = this.mCopy(this.aPhotoCollection);
      this.mGetIcon();
    },

    // [원본] 수동편집
    mHandleOkOriginalEditorImage() {
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked);
      // if (this.bProductDetailsEditor) {
      //   aCheckedImages = this.aPhotoCollection;
      // }
      if (aCheckedImages.length === 0) {
        alert('수동편집 대상이 없습니다.');
        return false;
      }

      this.aBakPhotoCollection = this.mCopy(this.aPhotoCollection);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.sSelectedPictureLink = aCheckedImages[0].original_url;
      this.mLoadImage(this.sSelectedPictureLink);
      this.bOriginalImageEditorModule = true;
    },

    // [번역] 수동편집
    mHandleOkTranslateEditorImage() {
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked && data.translate_status);
      if (aCheckedImages.length === 0) {
        alert('수동편집 대상이 없습니다.');
        return false;
      }

      this.aBakPhotoCollection = this.mCopy(this.aPhotoCollection);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.sSelectedPictureLink = aCheckedImages[0].translate_url;
      this.mLoadImage(this.sSelectedPictureLink);
      this.bTranslateImageEditorModule = true;
    },

    // [원본] 편집기 확인
    mHandleOkOriginalImage() {
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.bImageEdited = true;
      this.mSetOriginalImage();
      this.bOriginalImageEditorModule = false;
    },

    // [번역] 편집기 확인
    mHandleOkTranslateImage() {
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked && data.translate_status);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.bImageEdited = true;
      this.mSetTranslateImage();
      this.bTranslateImageEditorModule = false;
    },

    // [원본] 편집기 취소
    mOriginalImageCancel() {
      this.bImageEdited = false;
      this.bTranslateStatus = false;
      this.mSetOriginalImage();
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.aPhotoCollection = this.mCopy(this.aBakPhotoCollection);
      this.bOriginalImageEditorModule = false;
    },

    // [번역] 편집기 취소
    mTranslateImageCancel() {
      this.bImageEdited = false;
      this.bTranslateStatus = true;
      this.mSetTranslateImage();
      let aCheckedImages = this.aPhotoCollection.filter(data => data.checked && data.translate_status);
      this.iSelectedPictureIndex = aCheckedImages[0].key;
      this.aPhotoCollection = this.mCopy(this.aBakPhotoCollection);
      this.bTranslateImageEditorModule = false;
    },

    // [원본] 편집기 단일 저장
    mSaveOringinalEditorImage(key) {
      if (parseInt(this.iSelectedPictureIndex) !== parseInt(key)) {
        alert('편집중의 이미지가 아닙니다.');
        return false;
      }
      this.bLoading = true;
      this.url = window._imageEditor.toDataURL();
      let file = this.mBase64Decode(this.url);
      this.mHandleBeforeUpload(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image_type', 'product');
      formData.append('product_idx', this.iProductId);
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/image', formData).then((res) => {
        let response = res.data;
        if (response === undefined) {
          alert('업로드 실패');
          this.bLoading = false;
          return false;
        }

        if (response.status !== 'success') {
          alert('업로드 실패');
          this.bLoading = false;
          return false;
        }

        let iImageIndex;
        this.aPhotoCollection.map((data, i) => {
          if (data.key === key) {
            iImageIndex = i;
            this.aPhotoCollection[i].original_url = response['img_url'];
          }
        })

        this.bImageEdited = true;

        setTimeout(() => {
          _$(`.newImageEditorList img:eq(${iImageIndex})`).css({
            border: '10px inset red',
          });
          this.bLoading = false;
        })
      });
    },

    // [번역] 편집기 단일 저장
    mSaveTranslateEditorImage(key) {
      if (parseInt(this.iSelectedPictureIndex) !== parseInt(key)) {
        alert('편집중의 이미지가 아닙니다.');
        return false;
      }
      this.bLoading = true;
      this.url = window._imageEditor.toDataURL();
      let file = this.mBase64Decode(this.url);
      this.mHandleBeforeUpload(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image_type', 'product');
      formData.append('product_idx', this.iProductId);
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/image', formData).then((res) => {
        let response = res.data;
        if (response === undefined) {
          alert('업로드 실패');
          this.bLoading = false;
          return false;
        }

        if (response.status !== 'success') {
          alert('업로드 실패');
          this.bLoading = false;
          return false;
        }

        let iImageIndex;
        this.aPhotoCollection.map((data, i) => {
          if (data.key === key) {
            iImageIndex = i;
            this.aPhotoCollection[i].translate_url = response['img_url'];
          }
        })

        this.bImageEdited = true;

        setTimeout(() => {
          _$(`.newImageEditorList img:eq(${iImageIndex})`).css({
            border: '10px inset red',
          });
          this.bLoading = false;
        })
      });
    },

    // [번역] 편집기 [기존, 번역] 선택
    _mSeleteEditorImageType(url, key) {
      if (key !== this.iSelectedPictureIndex) {
        alert('편집중의 이미지가 아닙니다.');
        return false;
      }
      this.sSelectedPictureLink = url;
      this.mLoadImage(url);
    },

    // 편집기 이미지 선택
    mSeleteEditorImageType(url, key) {
      this.iSelectedPictureIndex = key;
      this.sSelectedPictureLink = url;
      this.mLoadImage(url);
    },

    setSelectedPictureIndex(item) {
      this.iSelectedPictureIndex = item.key;
      item.translate_status? this.mSetTranslateImage(): this.mSetOriginalImage();
    },

    // [팝업] 기존 버튼
    mSetOriginalImage() {
      let aTemp = this.aPhotoCollection.filter(data => data.key === this.iSelectedPictureIndex);
      this.sSelectedPictureLink = aTemp[0].original_url;
      this.originalBtn = `border: none; background-color: #7093DB; color: white;`;
      this.translateBtn = `border: 1px solid #7093DB; color: #7093DB;`;
    },

    // [팝업] 번역 버튼
    mSetTranslateImage() {
      let aTemp = this.aPhotoCollection.filter(data => data.key === this.iSelectedPictureIndex);
      this.sSelectedPictureLink = aTemp[0].translate_url;
      this.originalBtn = `border: 1px solid #7093DB; color: #7093DB;`;
      this.translateBtn = `border: none; background-color: #7093DB; color: white;`;
    },

    // [팝업] 확인
    mHandleOkTranslateWindow() {
      this.aPhotoCollection.map(data => {
        let key = data.order? data.order: data.key;

        if (data.translate_status === false) {
          this.$emit('pushImageData', key, data.original_url);
        } else {
          this.$emit('pushImageData', key, data.translate_url);
        }
      });

      this.mCloseTranslateWindow();
    },

    // [팝업] 취소
    mCloseTranslateWindow() {
      this.bLoading = false;
      this.bImageEdited = false;
      this.bTranslateStatus = false;
      this.iSelectedPictureIndex = 0;
      this.bProductDetailsEditor = false;
      this.aPhotoCollection = this.mCopy(this.aBakPhotoCollection);

      try {
        this.sSelectedPictureLink = this.aPhotoCollection[0].original_url;
      } catch (e) {}

      this.bImageEditorModule = false;
    },

    // [번역후] 이미지 선택
    mSeleteTranslate(item, index) {
      this.iSelectedPictureIndex = index;
      this.mSetTranslateImage();
    },

    // 번역 실패 버튼 클릭시 메세지
    mTranslateError(msg) {
      if (msg === undefined || msg === null) {
        alert('해당이미지는 번역할수없습니다.');
      } else {
        alert(msg);
      }

      return false;
    },

    // 상세 이미지 삭제 (필터링 실제삭제가 아님)
    mDeleteDetailImage() {
      let aDelImages = _$('.description_image:checked');
      if (aDelImages.length === 0) {
        alert('삭제할 이미지를 선택해 주세요');
        return;
      }
      if (_$('.description_image:not(:checked)').length === 0) {
        alert('번역시 이미지 최소 1개 필요합니다');
        aDelImages.attr('checked', false);
        return;
      }

      let aDelImagesIdx = [];
      _$.each(aDelImages, function () {
        aDelImagesIdx.push(Number(_$(this).val()));
      })
      aDelImages.attr('checked', false);
      this.aPhotoCollection = this.aPhotoCollection.filter((item, i)=> aDelImagesIdx.includes(i) === false);
    },

    // 전체선택
    mSelectDelImageReverse() {
      this.aPhotoCollection.map((data, i) => {
        this.aPhotoCollection[i].checked = true;
      })
    },

    // 선택취소
    mSelectDelImageReverseAll() {
      this.aPhotoCollection.map((data, i) => {
        this.aPhotoCollection[i].checked = false;
      })
    },

    mHandleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isJPEG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';

      if (!(isJPG || isJPEG || isPNG || isGIF)) {
        alert('허용되는 이미지 격식이 아닙니다.');
        return false;
      }

      return true;
    },

    mBase64Decode(dataURI) {
      // base64 解码
      let byteString = window.atob(dataURI.split(',')[1]);
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], {type: mimeString})
    },

    mGetIcon() {
      if (this.aIcons.length > 0) {
        return false;
      }

      this.iProductId = location.pathname.split('/')[3];
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prd', {params: {prduct_idx: this.iProductId}}).then((res) => {
        try {
          if (res.data.item_icons.length > 0) {
            this.aIcons = res.data.item_icons;
            window._imageEditor.uploadIcon(res.data.item_icons);
          }
        } catch (e) {}
      })
    },
  },

  mounted() {
    this.getRecharge();
  }
};
</script>

<style>
.list-group-item i {
  cursor: pointer;
}

.parent-element {
  text-align: center;
  position: relative;
  min-height: 600px;
  max-height: 900px;
}

.trans_success {
  background-color: #c0ebd7;
  display: block;
  text-align: center;
}

.trans_error{
  background-color: #FC9D9A;
  display: block;
  text-align: center;
  cursor: pointer;
}
</style>

<style scoped>
.checkedEl{
  border: 3px solid  #7093DB;
}
.checkedNot{
  border: 3px solid  white;
}
</style>
