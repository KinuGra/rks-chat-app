<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

import Chat from './Chat.vue'
import Thread from './Thread.vue'
import ThreadList from './ThreadList/ThreadList.vue'
import { initChatData } from './ThreadList/dummyData.js'

const threads = ref(initChatData)
const selectedThread = ref(null)
const newMessage = ref("")

const handleSelectThread = (thread) => {
  selectedThread.value = thread
}

// #region global state
const userName = inject("userName")
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
    <!-- 青いナビゲーションバー -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>SABI Chat</v-toolbar-title>
      <router-link to="/">
        <v-btn color="error" variant="flat" @click="onExit">
          退室する
        </v-btn>
      </router-link>
    </v-app-bar>

    <!-- メインコンテンツ -->
    <v-main>
      <v-container class="py-8">
        <h1 class="text-h4 font-weight-medium mb-6"></h1>

        <div v-if="$route.name === 'thread'" class="d-flex">
          <Chat @toggle-thread-list="toggleThreadList" />
          <Thread :selectedThread="selectedThread" :newMessage="newMessage" @update:newMessage="val => newMessage = val"
            @send-message="handleSendMessage" @toggle-tag="handleToggleTag" />
        </div>
        <Chat v-else />

        <!-- スレッドリスト表示 -->
        <ThreadList v-if="isThreadListShown" :threads="threads" @select-thread="handleSelectThread" />

      </v-container>
    </v-main>
  </v-app>
</template>


<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

.flex {
  display: flex;
}

.flex>div {
  flex: 1;
}
</style>