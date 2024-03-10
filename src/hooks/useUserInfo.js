import {useUserApi} from "@/api/user";
import {message} from "ant-design-vue";
import {onBeforeMount, ref} from "vue";

/**
 * 组件渲染前获取用户信息.
 * @param {Object} params
 * @param {function|null} onSuccess
 * @return {{userInfo: Ref<any>, loading: Ref<any>}}
 */
export function useUserInfo(params = {}, onSuccess = null) {
  const loading = ref()
  const userInfo = ref()

  async function getUserInfoData() {
    try {
      await useUserApi().getUserInfoData(params).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        userInfo.value = res.data;
        if (typeof onSuccess === 'function') {
          onSuccess(res.data)
        }
      });
    } catch (error) {
      message.error(error.message);
      return false;
    }
  }

  onBeforeMount(() => {
    loading.value = true
    return getUserInfoData().then(res => {
      loading.value = false
      return res
    })
  })

  return {
    loading,
    userInfo,
  }
}