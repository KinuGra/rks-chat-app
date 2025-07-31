<template>
  <div class="thread-container" v-if="props.selectedThread">
    <!-- 閉じるボタン -->
    <button class="close-button" @click="goToChat">×</button>

    <!-- ヘッダー -->
    <div class="header">
      <div>
        <h2>{{ props.selectedThread.title }}</h2>
        <div class="tags">
          <span
            v-for="tag in props.selectedThread.tags"
            :key="tag"
            class="tag"
            @click="$emit('toggle-tag', tag)"
          >
            {{ tag }} ✕
          </span>
        </div>
      </div>
      <button @click="isAddTagModalOpen = true">タグ追加</button>
    </div>

    <!-- メッセージ一覧 -->
    <div class="messages">
      <div
        v-for="msg in props.selectedThread.messages"
        :key="msg.id"
        :class="['message', msg.sender === 'user' ? 'right' : 'left']"
      >
        <div class="sender-label">{{ msg.sender === 'user' ? 'あなた' : msg.sender }}</div>
        <div class="bubble">{{ msg.content }}</div>
        <div class="timestamp">{{ new Date(msg.timestamp).toLocaleString() }}</div>
      </div>
    </div>

    <!-- メッセージ入力 -->
    <div class="input-area">
      <input
        type="text"
        :value="props.newMessage"
        @input="$emit('update:newMessage', $event.target.value)"
        @keyup.enter="$emit('send-message')"
        placeholder="メッセージを入力"
      />
      <button @click="$emit('send-message')">送信</button>
    </div>

    <!-- タグ追加モーダル -->
    <div v-if="isAddTagModalOpen" class="modal">
      <h3>タグの追加</h3>
      <input
        type="text"
        v-model="newTag"
        placeholder="新しいタグ名"
        @keyup.enter="addTag"
        class="text-input"
      />
      <div class="modal-actions">
        <button @click="addTag">追加</button>
        <button @click="isAddTagModalOpen = false">閉じる</button>
      </div>
    </div>
  </div>

  <div v-else class="no-thread">スレッドを選択してください</div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import socketManager from '../socketManager.js'

const props = defineProps({
  selectedThread: Object,
  newMessage: String
})

defineEmits([
  'update:newMessage',
  'send-message',
  'toggle-tag'
])

const router = useRouter()
const socket = socketManager.getInstance()
const userName = inject('userName')

const isAddTagModalOpen = ref(false)
const newTag = ref('')

function goToChat() {
  socket.emit('exitEvent', { userName: userName.value })
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
  props.selectedThread.tags.push(tag)
  newTag.value = ''
  isAddTagModalOpen.value = false
}
</script>