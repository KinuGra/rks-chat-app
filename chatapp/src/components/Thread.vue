<template>
  <div class="pa-0 fill-height thread-panel" style="width: 100%;">
    <!-- スレッドが選択されている場合 -->
    <div v-if="props.selectedThread" class="fill-height">
      <v-card class="fill-height d-flex flex-column" elevation="0" rounded="0" style="width: 100%;">
        <!-- ヘッダー（タイトル・タグ） -->
        <v-card-title class="d-flex justify-space-between align-start">
          <div class="flex-grow-1">
            <div class="text-h6 font-weight-bold text-primary mb-2">
              {{ props.selectedThread.title }}
            </div>
            <div class="d-flex flex-wrap">
              <v-chip v-for="tag in props.selectedThread.tags" :key="tag" class="ma-1" size="small" color="primary"
                variant="outlined" closable @click:close="$emit('toggle-tag', tag)">
                {{ tag }}
              </v-chip>
            </div>
          </div>
          <div class="d-flex flex-column align-end ga-2">
            <v-btn color="primary" variant="outlined" size="small" prepend-icon="mdi-tag-plus"
              @click="isAddTagModalOpen = true">
              タグ追加
            </v-btn>
            <v-btn icon="mdi-close" variant="text" @click="goToChat" />
          </div>
        </v-card-title>

        <v-divider />

        <!-- メッセージ一覧 -->
        <v-card-text class="flex-grow-1 overflow-y-auto px-4 py-2">
          <div v-for="msg in props.selectedThread.messages" :key="msg.id || msg.timestamp + msg.sender"
            class="d-flex mb-4" :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
            <div :class="[
              'd-inline-block',
              msg.sender === 'user' ? 'text-right' : 'text-left'
            ]" style="max-width: 70%;">
              <v-chip size="x-small" class="mb-1" :color="msg.sender === 'user' ? 'primary' : 'grey'" variant="flat">
                {{ msg.sender === 'user' ? 'あなた' : msg.sender }}
              </v-chip>

              <v-sheet class="pa-3" :color="msg.sender === 'user' ? 'primary' : 'grey-lighten-4'"
                :class="msg.sender === 'user' ? 'text-white' : 'text-black'" elevation="1" rounded>
                {{ msg.content }}
              </v-sheet>

              <div class="text-caption text-grey mt-1">
                {{ new Date(msg.timestamp).toLocaleString() }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- メッセージ入力 -->
        <v-card-text class="pa-4">
          <v-row no-gutters class="align-center ga-3">
            <v-col cols="10">
              <v-text-field :model-value="props.newMessage" @update:model-value="$emit('update:newMessage', $event)"
                @keyup.enter="$emit('send-message')" label="メッセージ" placeholder="メッセージを入力..." variant="outlined"
                density="comfortable" hide-details prepend-inner-icon="mdi-message-text" />
            </v-col>
            <v-col cols="2">
              <v-btn color="primary" size="large" @click="handleSendMessage" :disabled="!props.newMessage?.trim()"
                class="text-none px-6" elevation="2">
                <v-icon start>mdi-send</v-icon>
                送信
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- タグ追加モーダル -->
      <v-dialog v-model="isAddTagModalOpen" max-width="400">
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon icon="mdi-tag-plus" class="mr-2" />
            タグの追加
          </v-card-title>

          <v-card-text>
            <v-text-field v-model="newTag" placeholder="新しいタグ名を入力..." variant="outlined" density="comfortable"
              @keyup.enter="addTag" prepend-inner-icon="mdi-tag" autofocus />
          </v-card-text>

          <v-card-actions class="px-6 pb-4">
            <v-spacer />
            <v-btn text @click="isAddTagModalOpen = false">キャンセル</v-btn>
            <v-btn color="primary" @click="addTag" :disabled="!newTag?.trim()">
              追加
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- スレッドが未選択の場合 -->
    <div v-else class="d-flex justify-center align-center fill-height flex-column text-grey-darken-1">
      <v-icon icon="mdi-chat" size="64" class="mb-4" />
      <p class="text-h6">スレッドが選択されていません</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import socketManager from '../socketManager.js'

const props = defineProps({
  selectedThread: Object,
  newMessage: String
})

const emit = defineEmits([
  'update:newMessage',
  'send-message',
  'toggle-tag',
  'update-thread'
])


const router = useRouter()
const socket = socketManager.getInstance()
const userName = inject('userName')

const isAddTagModalOpen = ref(false)
const newTag = ref('')

function goToChat() {
  router.push('/chat/')
}

function addTag() {
  const tag = newTag.value.trim()
  if (!tag) {
    alert('タグ名を入力してください。')
    return
  }
  if (props.selectedThread.tags.includes(tag)) {
    alert('このタグは既に存在します。')
    return
  }

  // props を直接変更せず、親に emit で通知
  const updated = {
    ...props.selectedThread,
    tags: [...props.selectedThread.tags, tag]
  }
  emit('update-thread', updated)
  newTag.value = ''
  isAddTagModalOpen.value = false
}
</script>
