<script setup lang="ts">
import { KTDropdown } from '@keenthemes/ktui/src'
import { computed, nextTick, onMounted, ref } from 'vue'
import { ApiService } from '@/service/fetch'
import { useTagsStore } from '@/store/tags'

// Tag数据结构
export interface Tag {
  id?: number // 可选，后端返回的tag有id，新建的tag没有id
  text: string
  background: string
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

// 使用tags store
const tagsStore = useTagsStore()

// 编辑模式（默认为非编辑状态）
const isEditMode = ref(false)

// 保存loading状态（批量保存所有tags）
const isSaving = ref(false)

// 工作副本（编辑时的临时数据，添加临时key用于v-for）
const workingTags = ref<Array<Tag & { _key: string }>>([])

// 初始化工作副本
function initWorkingTags() {
  workingTags.value = props.modelValue.map(tag => ({
    ...tag,
    _key: tag.id ? `tag-${tag.id}` : `new-${Date.now()}-${Math.random()}`,
  }))
}

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

// 已有标签（从store获取）
const existingTags = computed(() => tagsStore.existingTags)
const isLoadingTags = computed(() => tagsStore.isLoading)

// 显示的tags（编辑模式用workingTags，非编辑模式用props.modelValue加_key）
const displayTags = computed(() => {
  if (isEditMode.value) {
    return workingTags.value
  }
  else {
    // 非编辑模式也需要_key用于v-for
    return props.modelValue.map(tag => ({
      ...tag,
      _key: tag.id ? `tag-${tag.id}` : `readonly-${Math.random()}`,
    }))
  }
})

// 进入编辑模式
function enterEditMode() {
  initWorkingTags()
  isEditMode.value = true
  nextTick(() => {
    KTDropdown.init()
  })
}

// 批量保存所有tags（点击对勾时）
async function saveAllTags() {
  if (isSaving.value)
    return

  isSaving.value = true

  try {
    const savedTags: Tag[] = []

    // 处理每个tag
    for (const tag of workingTags.value) {
      // 判断是否为新tag：没有id就是新tag
      const isNewTag = !tag.id

      if (isNewTag) {
        // POST创建新标签（不发送id字段）
        const response = await ApiService.post<Tag>('/tag', {
          text: tag.text,
          background: tag.background,
        })
        const savedTag = response.data.value
        savedTags.push(savedTag)

        // 添加到store
        tagsStore.addTag(savedTag)
      }
      else {
        // 检查是否有变化
        const originalTag = props.modelValue.find(t => t.id === tag.id)
        const hasChanges = originalTag
          && (originalTag.text !== tag.text || originalTag.background !== tag.background)

        if (hasChanges) {
          // PATCH更新现有标签
          await ApiService.patch(`/tag/${tag.id}`, {
            text: tag.text,
            background: tag.background,
          })

          // 更新store中的标签
          tagsStore.updateTag(String(tag.id), {
            text: tag.text,
            background: tag.background,
          })
        }

        savedTags.push(tag)
      }
    }

    // 更新父组件的值
    emit('update:modelValue', savedTags)

    // 退出编辑模式
    isEditMode.value = false
    workingTags.value = []
  }
  catch (error) {
    console.error('Failed to save tags:', error)
    // 可以添加错误提示
  }
  finally {
    isSaving.value = false
  }
}

// 更新tag属性（通过_key查找）
function updateTag(tagKey: string, updates: Partial<Tag>) {
  const index = workingTags.value.findIndex(t => t._key === tagKey)
  if (index !== -1) {
    workingTags.value[index] = {
      ...workingTags.value[index],
      ...updates,
    }
  }
}

// 删除tag（通过_key）
function deleteTag(tagKey: string) {
  workingTags.value = workingTags.value.filter(t => t._key !== tagKey)
}

// 添加新tag
function addNewTag() {
  const newTag: Tag & { _key: string } = {
    // 不设置id，新tag没有id
    text: 'New Tag',
    background: colorPresets[0].value,
    _key: `new-${Date.now()}-${Math.random()}`, // 临时key用于v-for
  }
  workingTags.value = [...workingTags.value, newTag]

  nextTick(() => {
    KTDropdown.init()
  })
}

// 使用已有标签（直接替换为已有tag，不创建新tag）
function useExistingTag(existingTag: Tag, targetKey: string) {
  const index = workingTags.value.findIndex(t => t._key === targetKey)
  if (index !== -1) {
    // 检查是否已经存在这个tag
    const alreadyExists = workingTags.value.some(t => t.id === existingTag.id)

    if (alreadyExists) {
      // 如果已经存在，只删除当前正在编辑的tag
      workingTags.value.splice(index, 1)
    }
    else {
      // 如果不存在，替换为已有tag
      workingTags.value[index] = {
        ...existingTag,
        _key: existingTag.id ? `tag-${existingTag.id}` : `new-${Date.now()}-${Math.random()}`,
      }
    }
  }
}

onMounted(async () => {
  // 从store加载已有标签（如果还没加载过，则会发起请求；否则使用缓存）
  await tagsStore.fetchExistingTags()

  nextTick(() => {
    KTDropdown.init()
  })
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <!-- Tag列表 -->
      <template v-for="tag in displayTags" :key="tag._key">
        <div class="relative group">
          <!-- 非编辑模式：普通展示 -->
          <span
            v-if="!isEditMode"
            :class="tag.background"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ tag.text }}
          </span>

          <!-- 编辑模式：可点击编辑 -->
          <div
            v-else
            data-kt-dropdown="true"
            data-kt-dropdown-trigger="click"
            data-kt-dropdown-placement="bottom-start"
          >
            <button
              type="button"
              :class="tag.background"
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
              data-kt-dropdown-toggle="true"
            >
              <span>{{ tag.text }}</span>

              <!-- 删除按钮 -->
              <i
                class="ki-outline ki-cross text-[10px] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                @click.stop="deleteTag(tag._key)"
              />
            </button>

            <!-- 编辑下拉面板 -->
            <div
              class="kt-dropdown w-64 p-4 space-y-3"
              data-kt-dropdown-menu="true"
            >
              <!-- 文字输入 -->
              <div>
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Text
                </label>
                <input
                  :value="tag.text"
                  type="text"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateTag(tag._key, { text: ($event.target as HTMLInputElement).value })"
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
                      tag.background === color.value ? 'ring-2 ring-blue-500' : '',
                    ]"
                    class="w-full h-8 rounded-lg text-[10px] font-medium hover:opacity-80 transition-all"
                    @click="updateTag(tag._key, { background: color.value })"
                  >
                    {{ color.name }}
                  </button>
                </div>
              </div>

              <!-- 已有标签 -->
              <div>
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Existing Tags
                </label>

                <!-- Loading状态 -->
                <div v-if="isLoadingTags" class="text-center py-4">
                  <i class="ki-outline ki-loading animate-spin text-gray-400" />
                </div>

                <!-- 标签列表 -->
                <div v-else-if="existingTags.length > 0" class="max-h-32 overflow-y-auto flex flex-wrap gap-2">
                  <button
                    v-for="(existingTag, index) in existingTags"
                    :key="index"
                    type="button"
                    :class="existingTag.background"
                    class="px-2.5 py-1 rounded-full text-[10px] font-medium hover:opacity-80 transition-opacity cursor-pointer"
                    @click="useExistingTag(existingTag, tag._key)"
                  >
                    {{ existingTag.text }}
                  </button>
                </div>

                <!-- 空状态 -->
                <div v-else class="text-center py-4 text-xs text-gray-400">
                  No existing tags
                </div>
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

      <!-- 编辑/完成按钮 -->
      <button
        type="button"
        class="kt-btn kt-btn-icon kt-btn-ghost kt-btn-sm"
        :title="isEditMode ? 'Save all changes' : 'Edit tags'"
        :disabled="isSaving"
        @click="isEditMode ? saveAllTags() : enterEditMode()"
      >
        <i v-if="isSaving" class="ki-outline ki-loading animate-spin" />
        <i v-else-if="isEditMode" class="ki-outline ki-check" />
        <i v-else class="ki-outline ki-pencil" />
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
