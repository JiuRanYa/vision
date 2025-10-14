<script setup lang="ts">
import { KTDropdown } from '@keenthemes/ktui/src'
import { computed, nextTick, onMounted, ref } from 'vue'

// Tag数据结构
export interface Tag {
  id: string
  text: string
  color: string
}

// Props定义
interface EditableTagsProps {
  modelValue: Tag[]
}

const props = defineProps<EditableTagsProps>()

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [tags: Tag[]]
}>()

// 编辑模式
const isEditMode = ref(false)

// 当前编辑的tag ID
const editingTagId = ref<string | null>(null)

// 编辑中的tag数据
const editingTag = ref<{ text: string, color: string }>({ text: '', color: '' })

// 预设颜色列表
const colorPresets = [
  { name: 'Gray', value: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' },
  { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' },
  { name: 'Green', value: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' },
  { name: 'Red', value: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' },
  { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' },
  { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' },
  { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200' },
  { name: 'Indigo', value: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200' },
]

// 内部tags
const internalTags = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 切换编辑模式
function toggleEditMode() {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    editingTagId.value = null
  }
  nextTick(() => {
    KTDropdown.init()
  })
}

// 打开tag编辑
function openTagEdit(tag: Tag) {
  if (!isEditMode.value)
    return

  editingTagId.value = tag.id
  editingTag.value = {
    text: tag.text,
    color: tag.color,
  }

  nextTick(() => {
    KTDropdown.init()
  })
}

// 保存tag编辑
function saveTagEdit(tagId: string) {
  const tagIndex = internalTags.value.findIndex(t => t.id === tagId)
  if (tagIndex !== -1) {
    const updatedTags = [...internalTags.value]
    updatedTags[tagIndex] = {
      ...updatedTags[tagIndex],
      text: editingTag.value.text,
      color: editingTag.value.color,
    }
    internalTags.value = updatedTags
  }
  editingTagId.value = null
}

// 删除tag
function deleteTag(tagId: string) {
  internalTags.value = internalTags.value.filter(t => t.id !== tagId)
  editingTagId.value = null
}

// 添加新tag
function addNewTag() {
  const newTag: Tag = {
    id: `tag-${Date.now()}`,
    text: 'New Tag',
    color: colorPresets[0].value,
  }
  internalTags.value = [...internalTags.value, newTag]

  // 自动进入编辑
  nextTick(() => {
    openTagEdit(newTag)
  })
}

onMounted(() => {
  KTDropdown.init()
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <!-- Tag列表 -->
      <template v-for="tag in internalTags" :key="tag.id">
        <div class="relative group">
          <!-- 非编辑模式：普通展示 -->
          <span
            v-if="!isEditMode"
            :class="tag.color"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ tag.text }}
          </span>

          <!-- 编辑模式：可点击编辑 -->
          <div
            v-else
            class="inline-flex"
            data-kt-dropdown="true"
            data-kt-dropdown-trigger="click"
            data-kt-dropdown-placement="bottom-start"
          >
            <!-- Tag显示 -->
            <button
              type="button"
              :class="tag.color"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
              data-kt-dropdown-toggle="true"
              @click="openTagEdit(tag)"
            >
              <span>{{ tag.text }}</span>
              <i class="ki-outline ki-down text-[10px]" />
            </button>

            <!-- 删除按钮 -->
            <button
              type="button"
              class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
              title="Delete"
              @click.stop="deleteTag(tag.id)"
            >
              <i class="ki-outline ki-cross text-[10px]" />
            </button>

            <!-- 编辑下拉面板 -->
            <div
              v-if="editingTagId === tag.id"
              class="kt-dropdown w-64 p-4 space-y-3"
              data-kt-dropdown-menu="true"
            >
              <!-- 文字输入 -->
              <div>
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Text
                </label>
                <input
                  v-model="editingTag.text"
                  type="text"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="saveTagEdit(tag.id)"
                >
              </div>

              <!-- 颜色选择 -->
              <div>
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Color
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="color in colorPresets"
                    :key="color.value"
                    type="button"
                    :class="[
                      color.value,
                      editingTag.color === color.value ? 'ring-2 ring-blue-500' : '',
                    ]"
                    class="w-full h-8 rounded-lg text-[10px] font-medium hover:opacity-80 transition-all"
                    @click="editingTag.color = color.value"
                  >
                    {{ color.name }}
                  </button>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2 pt-2">
                <button
                  type="button"
                  class="flex-1 kt-btn kt-btn-sm"
                  @click="saveTagEdit(tag.id)"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="flex-1 kt-btn kt-btn-sm kt-btn-ghost"
                  @click="editingTagId = null"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 添加按钮（编辑模式） -->
      <button
        v-if="isEditMode"
        type="button"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        @click="addNewTag"
      >
        <i class="ki-outline ki-plus text-xs" />
        <span>Add</span>
      </button>

      <!-- 编辑模式切换按钮 -->
      <button
        type="button"
        class="kt-btn kt-btn-icon kt-btn-ghost kt-btn-sm"
        :title="isEditMode ? 'Done' : 'Edit Tags'"
        @click="toggleEditMode"
      >
        <i v-if="!isEditMode" class="ki-outline ki-pencil" />
        <i v-else class="ki-outline ki-check" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 确保dropdown能正常显示 */
[data-kt-dropdown-menu="true"] {
  z-index: 1000;
}
</style>
