<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

import Chat from './Chat.vue'
import Thread from './Thread.vue'
import ThreadListModal from './ThreadList/ThreadList.vue'
import { initChatData } from './ThreadList/dummyData.js'

const threads = ref(initChatData)
const selectedThread = ref(null)
const newMessage = ref("")

const handleSelectThread = (thread) => {
  selectedThread.value = thread
  emit("select-thread", thread);
}

// #region global state
const injectedUserName = inject("userName");
const userName = ref("");

// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
// #endregion

// #region lifecycle
onMounted(() => {
  // localStorageから取得（なければinjectされたもの）
  userName.value = localStorage.getItem("userName") || injectedUserName;
  registerSocketEvent()
})
// #endregion

const form = reactive({
  message: "",
});

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  socket.emit("publishEvent", { userName: userName.value, message: form.message })

  // 入力欄を初期化
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", { userName: userName.value })
}

// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
  if (form.message === "") {
    alert("メモの内容を入力してください。")
    return
  }
  chatList.push(`${userName.value}さんのメモ: ${form.message}`)
  //入力値を初期化
  form.message = ""
}
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.push(data.userName + "さんが入室しました。");
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.push(data.userName + "さんが退室しました。")
}

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.push(`${data.userName}さんのメッセージ：${data.message}`)
  form.message = "";
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    onReceiveEnter(data);
  })

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    onReceiveExit(data)
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data);
  })
}
// #endregion

//modal event
const isThreadListShown = ref(false);

const toggleThreadList = () => {
  isThreadListShown.value = !isThreadListShown.value;
}

// #end modal event

</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>SABI Chat</v-toolbar-title>
      <router-link to="/">
        <v-btn color="error" variant="flat" @click="onExit">退室する</v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <div class="main-wrapper">

        <div v-if="$route.name === 'thread'" class="chat-thread-wrapper">
          <Chat class="chat-panel" @toggle-thread-list="toggleThreadList" @select-thread="handleSelectThread" />
          <Thread class="thread-panel" :selectedThread="selectedThread" :newMessage="newMessage"
            @update:newMessage="val => newMessage = val" @send-message="handleSendMessage"
            @toggle-tag="handleToggleTag" />
        </div>

        <Chat v-else class="chat-panel" />

        <ThreadListModal v-model:showModal="isThreadListShown" @select-thread="handleSelectThread" />

      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-wrapper {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.chat-thread-wrapper {
  display: flex;
  width: 100%;
  gap: 16px;
}

.chat-panel {
  flex: 0 0 40%;
  min-width: 0;
}

.thread-panel {
  flex: 0 0 60%;
  min-width: 60%;
}


h1 {
  margin: 0 0 16px 0;
}
</style>
