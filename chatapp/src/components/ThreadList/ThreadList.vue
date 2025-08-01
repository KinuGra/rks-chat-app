<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import FilterModal from './FilterModal.vue'
import socketManager from '../../socketManager.js'

const props = defineProps({
  showModal: Boolean,
  threads: {
    type: Array,
    required: false // WebSocketで取得するので optional
  }
})

const emit = defineEmits(['update:showModal', 'select-thread'])

const modalState = computed({
  get: () => props.showModal,
  set: (value) => emit('update:showModal', value)
})

const chatHistory = reactive([])
const socket = socketManager.getInstance()

onMounted(() => {
  socket.emit("plzData", null)
  socket.on("plzData", (data) => {
    chatHistory.splice(0)
    chatHistory.push(...data)
    console.log("[WebSocket] 受信データ:", chatHistory)
  })
})

const isShowFilterModal = ref(false)
const filterTag = ref('全スレッド')
const selectedThreadId = ref(null)

const filteredThreads = computed(() => {
  const threads = chatHistory.filter(chat => chat.type === 'thread')
  if (filterTag.value === '全スレッド') return threads.slice().reverse()
  return threads.filter(chat => chat.tags?.includes(filterTag.value)).slice().reverse()
})

const availableTags = computed(() => {
  const tags = new Set()
  chatHistory
    .filter(chat => chat.type === 'thread')
    .forEach(chat => chat.tags?.forEach(tag => tags.add(tag)))
  return Array.from(tags)
})

const showFilterModal = () => {
  isShowFilterModal.value = true
}

const handleUpdate = (tag) => {
  filterTag.value = tag
  console.log(`${tag} で絞り込みます`)
  isShowFilterModal.value = false
}

const selectThread = (chat) => {
  selectedThreadId.value = chat.id
  modalState.value = false
  emit('select-thread', chat)
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>


<template>
  <!-- スレッド一覧モーダル -->
  <v-dialog 
    v-model="modalState" 
    max-width="800" 
    persistent
    class="thread-list-dialog"
  >
    <v-card class="thread-modal-card">
      <!-- ヘッダー -->
      <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
        <div class="d-flex align-center">
          <v-icon icon="mdi-chat-outline" class="mr-3" color="white" />
          <span class="text-h5 font-weight-bold text-white">スレッド一覧</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          @click="modalState = false"
        />
      </v-card-title>

      <!-- フィルター部分 -->
      <v-card-text class="pa-4 bg-grey-lighten-5">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <v-chip
              :color="filterTag === '全スレッド' ? 'primary' : 'grey-lighten-2'"
              :variant="filterTag === '全スレッド' ? 'flat' : 'outlined'"
              @click="filterTag = '全スレッド'"
              class="filter-chip"
            >
              <v-icon start icon="mdi-view-list" />
              全スレッド
            </v-chip>
            <v-chip
              v-for="tag in availableTags"
              :key="tag"
              :color="filterTag === tag ? 'secondary' : 'grey-lighten-2'"
              :variant="filterTag === tag ? 'flat' : 'outlined'"
              @click="filterTag = tag"
              class="filter-chip"
            >
              <v-icon start icon="mdi-tag" />
              {{ tag }}
            </v-chip>
          </div>
          
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-filter"
            @click="showFilterModal"
          >
            詳細フィルター
          </v-btn>
        </div>
      </v-card-text>

      <!-- スレッド一覧 -->
      <v-card-text class="pa-0" style="max-height: 60vh; overflow-y: auto;">
        <v-list class="thread-list">
          <template v-for="(chat, index) in filteredThreads" :key="chat.id">
            <v-list-item
              @click="selectThread(chat)"
              class="thread-item pa-4"
              :class="{ 'selected-thread': selectedThreadId === chat.id }"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="40">
                  <v-icon icon="mdi-chat" color="white" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-h6 font-weight-medium mb-2">
                {{ chat.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-body-2 text-grey-darken-1 mb-3">
                {{ chat.messages[0]?.content || 'メッセージがありません' }}
              </v-list-item-subtitle>

              <!-- タグ表示 -->
              <div class="d-flex flex-wrap ga-1 mb-2" v-if="chat.tags?.length">
                <v-chip
                  v-for="tag in chat.tags"
                  :key="tag"
                  size="x-small"
                  color="secondary"
                  variant="outlined"
                  class="tag-chip"
                >
                  {{ tag }}
                </v-chip>
              </div>

              <!-- メタ情報 -->
              <div class="d-flex justify-space-between align-center text-caption text-grey mt-2">
                <span>
                  <v-icon icon="mdi-message-outline" size="small" class="mr-1" />
                  {{ chat.messages?.length || 0 }} メッセージ
                </span>
                <span v-if="chat.messages?.length">
                  {{ formatDate(chat.messages[chat.messages.length - 1].timestamp) }}
                </span>
              </div>

              <template v-slot:append>
                <v-btn
                  icon="mdi-chevron-right"
                  variant="text"
                  size="small"
                  color="grey"
                />
              </template>
            </v-list-item>

            <v-divider v-if="index < filteredThreads.length - 1" />
          </template>

          <!-- スレッドが見つからない場合 -->
          <div v-if="filteredThreads.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-chat-remove-outline" size="64" color="grey-lighten-1" class="mb-4" />
            <h3 class="text-h6 text-grey-darken-1 mb-2">スレッドが見つかりません</h3>
            <p class="text-body-2 text-grey">
              {{ filterTag === '全スレッド' ? 'スレッドがまだ作成されていません' : `"${filterTag}" でフィルターされたスレッドはありません` }}
            </p>
          </div>
        </v-list>
      </v-card-text>

      <!-- フッター -->
      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer />
        <v-btn variant="text" @click="modalState = false">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- フィルターモーダル -->
  <v-dialog v-model="isShowFilterModal" max-width="400">
    <FilterModal @update="handleUpdate" @close="isShowFilterModal = false" />
  </v-dialog>
</template>

<style>
.modal-wrapper {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ddd;
    border: 1px solid #ccc;
    padding: 1.5rem;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    width: 30%;
}
</style>