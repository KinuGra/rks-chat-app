<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

import { initChatData } from './ThreadList/dummyData.js';
const chatHistory = reactive(initChatData)

import Modal from './Modal.vue'

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
  threadTitle: "",
  messageId: ""
});

const threadButtonStatus = reactive({
  isShow: false,
})

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  const data = {
    sender: userName.value,
    content: chatContent.value,
  }
  console.log("onPublish", userName.value)
  socket.emit("publishEvent", data)

  // 入力欄を初期化
  chatContent.value = "";
}

// スレッド新規作成画面を表示
const onShowThreadSetting = (id) => {
  // form.threadTitle = event.target.attributes[2].nodeValue;
  form.threadTitle = "";
  form.messageId = id;
  console.log(id);
  threadButtonStatus.isShow = true;
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

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.push(`${data.sender}さんのメッセージ：${data.content}`)
}
// #endregion

// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.push(...data);
}

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    onReceiveEnter(data);
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data);
  })
  // login時にチャット履歴を表示
  socket.emit("getChatHistory", (history) => {
    chatList.push(...history);
  });

}
// #endregion

  
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Chat.vue</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
    </div>
    
    <!-- 右側 -->
    
    <div class="chatarea">
      <!-- <p>ログインユーザ：{{ userName }}さん</p> -->
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList.slice().reverse()" :key="i">{{ chat }}
            <!-- スレッドの有無で条件分岐 -->
            <button class="button-normal" :text="chat" @click="onShowThreadSetting(i)">スレッドを作成</button>
            <button class="button-normal" @click="">スレッドを表示</button>
            
          </li>
        </ul>
      </div>
    </div>
    <div v-if="threadButtonStatus.isShow" class="thread-setting">
      <input v-model="form.threadTitle" placeholder="スレッドのタイトルを入力" variant="outlined" rows="1" class="area" name="title">
      <button class="button-normal" @click="onCreateThread">スレッドを作成</button>
      <button class="button-normal" @click="onCancelCreateThread">キャンセル</button>
    </div>
    <!-- <div class="modal-wrapper"></div> -->
    
  <!-- 
  <router-link to="/" class="link">
    <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
  </router-link>
    -->
  </div>

  
  <!-- 
  <router-link to="/" class="link">
    <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
  </router-link>
    -->
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

.chatlist-flex>div {
  flex: 1;
}

.chatarea {
  overflow-y: scroll;
  /* height: 72vh; */
}

.chat-textarea {
  display: flex;
}

.chatlist-flex>div:first-child {
  border-right: 1px solid #000;
}

.chatlist-flex {
  width: 100%;
  height: 82vh;
  display: flex;
}

.thread-setting {
  position: absolute;
  z-index: 3;
  background-color: #bbb;
  width: 480px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  text-align: center;
}

.thread-setting input {
  display: block;
  width: 80%;
  margin: 24px 10% 16px;
}

</style>