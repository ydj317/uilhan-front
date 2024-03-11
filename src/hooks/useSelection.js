import {ref} from "vue";

export function useSelection(list) {
  const selectList = ref(list)
  const selection = ref([])

  function resetList(newList) {
    selectList.value = newList
    selection.value = []
  }

  function toggleSelect(item) {
    const index = selection.value.indexOf(item)
    if (index >= 0) {
      selection.value.splice(index, 1)
    } else {
      selection.value.push(item)
    }
  }

  function toggleSelectAll() {
    if (selection.value.length < selectList.value.length) {
      selection.value = [...selectList.value]
    } else {
      selection.value = []
    }
  }

  function isSelect(item) {
    return selection.value.indexOf(item) >= 0
  }

  function isSelectAll() {
    return (
      selection.value.length > 0
      && selection.value.length === selectList.value.length
    )
  }

  function isSelectPart() {
    return selection.value.length > 0 && selection.value.length < selectList.value.length
  }

  return {
    selection,
    resetList,
    isSelect,
    isSelectAll,
    isSelectPart,
    toggleSelect,
    toggleSelectAll
  }
}