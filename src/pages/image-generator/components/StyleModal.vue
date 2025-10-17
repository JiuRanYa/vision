<script setup lang="ts">
import { computed, ref } from 'vue'

interface StyleItem {
  id: string
  name: string
  image: string
  prompt: string
  featured: boolean
}

interface Props {
  modalId: string
}

interface Emits {
  (e: 'select', style: StyleItem): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 搜索关键词
const searchQuery = ref('')

// 标签页
const tabs = [
  { id: 'all', label: 'All', icon: 'ki-element-11' },
  { id: 'featured', label: 'Featured', icon: 'ki-star' },
  { id: 'myStyles', label: 'My Styles', icon: 'ki-bookmark' },
]
const activeTab = ref('all')

// 风格数据
const styles: StyleItem[] = [
  {
    id: 'all',
    name: 'all',
    image: 'https://picsum.photos/400/400?random=0',
    prompt: '',
    featured: true,
  },
  {
    id: 'reference',
    name: 'Reference image',
    image: 'https://picsum.photos/400/400?random=1',
    prompt: 'based on reference image style',
    featured: true,
  },
  {
    id: 'risoprint',
    name: '# risoprint',
    image: 'https://picsum.photos/400/400?random=2',
    prompt: 'risoprint style, vibrant colors, textured print effect',
    featured: true,
  },
  {
    id: 'vitro',
    name: '# vitro',
    image: 'https://picsum.photos/400/400?random=3',
    prompt: 'vitro glass art style, translucent, reflective surfaces',
    featured: true,
  },
  {
    id: 'amigurumi3d',
    name: '# amigurumi3d',
    image: 'https://picsum.photos/400/400?random=4',
    prompt: 'amigurumi 3d style, cute crochet toy, handmade crafted look',
    featured: true,
  },
  {
    id: 'artofproduct',
    name: '# artofproduct',
    image: 'https://picsum.photos/400/400?random=5',
    prompt: 'product photography, professional lighting, clean background',
    featured: true,
  },
  {
    id: 'plasticinepeople',
    name: '# plasticinepeople',
    image: 'https://picsum.photos/400/400?random=6',
    prompt: 'plasticine clay people style, colorful, handmade sculpted',
    featured: true,
  },
  {
    id: 'photo',
    name: '# photo',
    image: 'https://picsum.photos/400/400?random=7',
    prompt: 'photorealistic, high quality photography, natural lighting',
    featured: false,
  },
  {
    id: 'illustration',
    name: '# illustration',
    image: 'https://picsum.photos/400/400?random=8',
    prompt: 'digital illustration, artistic style, vibrant colors',
    featured: false,
  },
  {
    id: '3d',
    name: '# 3d',
    image: 'https://picsum.photos/400/400?random=9',
    prompt: '3d render, cinematic lighting, octane render',
    featured: false,
  },
  {
    id: 'cartoonfun',
    name: '# cartoonfun',
    image: 'https://picsum.photos/400/400?random=10',
    prompt: 'cartoon style, fun and playful, bright colors',
    featured: false,
  },
  {
    id: 'comic',
    name: '# comic',
    image: 'https://picsum.photos/400/400?random=11',
    prompt: 'comic book style, bold lines, dramatic shading',
    featured: false,
  },
  {
    id: 'dark',
    name: '# dark',
    image: 'https://picsum.photos/400/400?random=12',
    prompt: 'dark moody atmosphere, low key lighting, mysterious',
    featured: false,
  },
  {
    id: 'watercolor',
    name: '# watercolor',
    image: 'https://picsum.photos/400/400?random=13',
    prompt: 'watercolor painting style, soft edges, flowing colors',
    featured: false,
  },
  {
    id: 'pixelart',
    name: '# pixelart',
    image: 'https://picsum.photos/400/400?random=14',
    prompt: 'pixel art style, retro 8-bit aesthetic, blocky details',
    featured: false,
  },
  {
    id: 'surreal',
    name: '# surreal',
    image: 'https://picsum.photos/400/400?random=15',
    prompt: 'surreal dreamlike imagery, unexpected combinations',
    featured: false,
  },
  {
    id: 'oilpainting',
    name: '# oilpainting',
    image: 'https://picsum.photos/400/400?random=16',
    prompt: 'oil painting style, thick brushstrokes, rich textures',
    featured: false,
  },
  {
    id: 'inkdotist',
    name: '# inkdotist',
    image: 'https://picsum.photos/400/400?random=17',
    prompt: 'ink dot art style, intricate patterns, black and white',
    featured: false,
  },
  {
    id: 'pencil',
    name: '# pencil',
    image: 'https://picsum.photos/400/400?random=18',
    prompt: 'pencil sketch style, hand drawn, detailed shading',
    featured: false,
  },
  {
    id: 'retrowave',
    name: '# retrowave',
    image: 'https://picsum.photos/400/400?random=19',
    prompt: 'retrowave synthwave style, neon colors, 80s aesthetic',
    featured: false,
  },
  {
    id: 'creativeportrait',
    name: '# creativeportrait',
    image: 'https://picsum.photos/400/400?random=20',
    prompt: 'creative portrait photography, artistic composition',
    featured: false,
  },
]

// 过滤后的风格
const filteredStyles = computed(() => {
  let result = styles

  // 根据标签页过滤
  if (activeTab.value === 'featured') {
    result = result.filter(s => s.featured)
  }
  else if (activeTab.value === 'myStyles') {
    result = [] // 用户自定义风格，暂时为空
  }

  // 根据搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(query) || s.prompt.toLowerCase().includes(query),
    )
  }

  return result
})

// 选择风格
function selectStyle(style: StyleItem) {
  emit('select', style)
}
</script>

<template>
  <div
    :id="modalId"
    class="kt-modal"
    data-kt-modal="true"
  >
    <div class="kt-modal-content max-w-[1200px] top-[5%] h-[85vh]">
      <div class="kt-modal-header">
        <h3 class="kt-modal-title">
          Style
        </h3>
        <button
          class="kt-modal-close"
          aria-label="Close modal"
          :data-kt-modal-dismiss="`#${modalId}`"
        >
          <i class="ki-outline ki-cross text-lg" />
        </button>
      </div>

      <div class="kt-modal-body p-6">
        <!-- 顶部工具栏 -->
        <div class="flex items-center gap-4 mb-6">
          <!-- 标签页 -->
          <div class="flex items-center gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="kt-btn kt-btn-sm transition-all"
              :class="[
                activeTab === tab.id
                  ? 'kt-btn-primary'
                  : 'kt-btn-light',
              ]"
              @click="activeTab = tab.id"
            >
              <i :class="`ki-outline ${tab.icon} text-sm`" />
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <div class="flex-1" />

          <!-- New style 按钮 -->
          <button class="kt-btn kt-btn-sm kt-btn-primary">
            <i class="ki-outline ki-plus text-sm" />
            <span>New style</span>
          </button>

          <!-- 搜索框 -->
          <div class="relative w-64">
            <i class="ki-outline ki-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by style"
              class="w-full h-9 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- 风格网格 -->
        <div class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 overflow-y-auto max-h-[60vh] scrollbar-hover pr-2">
          <button
            v-for="style in filteredStyles"
            :key="style.id"
            class="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
            @click="selectStyle(style)"
          >
            <!-- 风格图片 -->
            <div class="aspect-square overflow-hidden">
              <img
                :src="style.image"
                :alt="style.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              >
            </div>

            <!-- Featured 图标 -->
            <div v-if="style.featured" class="absolute top-2 right-2">
              <span class="text-yellow-400 text-lg">👑</span>
            </div>

            <!-- 风格名称 -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p class="text-white text-xs font-medium truncate">
                {{ style.name }}
              </p>
            </div>

            <!-- Hover 遮罩 -->
            <div class="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredStyles.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ki-outline ki-picture text-2xl text-gray-400" />
          </div>
          <p class="text-gray-500 dark:text-gray-400">
            No styles found
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条样式 */
.scrollbar-hover {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.scrollbar-hover:hover {
  scrollbar-color: rgb(209 213 219) transparent;
}

.scrollbar-hover::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-hover::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-hover::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
}

.scrollbar-hover:hover::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
}

.dark .scrollbar-hover:hover::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}
</style>
