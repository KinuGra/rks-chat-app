<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";
import '@fortawesome/fontawesome-free/css/all.css'

const userName = inject("userName");
const socket = socketManager.getInstance();

const chatContent = ref("");
const chatList = reactive([]);

const form = reactive({
  message: "",
  threadTitle: "",
  messageId: ""
});

const threadButtonStatus = reactive({
  isShow: false,
});

const emit = defineEmits(["toggle-thread-list"]);

// 投稿
const onPublish = () => {
  const data = {
    sender: userName.value,
    content: chatContent.value,
    timestamp: new Date().toISOString(),
    type: "message"
  };
  socket.emit("publishEvent", data);
  chatContent.value = "";
};

// メモ
const onMemo = () => {
  if (!form.message) {
    alert("メモの内容を入力してください。");
    return;
  }
  chatList.push({
    sender: userName.value,
    content: form.message,
    timestamp: new Date().toISOString(),
    type: "memo"
  });
  form.message = "";
};

// 新規追加するスレッドの内容をサーバに送信する
const onCreateThread = () => {
  const data = {
    title: form.threadTitle,
    messageId: form.messageId,
  }
  console.log(data)
  socket.emit("createThread", data)

  // 入力欄を初期化
  chatContent.value = "";
}

// スレッド作成表示
const onShowThreadSetting = (id) => {
  form.threadTitle = "";
  form.messageId = id;
  threadButtonStatus.isShow = true;
};

// スレッド作成フォームを非表示にする
const onCancelCreateThread = () => {
  form.threadTitle = "";
  threadButtonStatus.isShow = false;
};


// サーバーから新しい投稿を受信したときの処理
const onReceivePublish = (data) => {
  chatList.splice(0);
  chatList.push(...data);
};


// 入室時にサーバーからチャット履歴を受信したときの処理
const onReceiveEnter = (data) => {
  chatList.splice(0);
  chatList.push(...data);
};

// サーバーから受け取ったチャット履歴を正規化する
const normalizeChat = (item) => {
  if (typeof item === "string") {
    try {
      const parsed = JSON.parse(item);
      return {
        sender: parsed.sender ?? "不明",
        content: parsed.content ?? "",
        timestamp: parsed.timestamp ?? new Date().toISOString(),
        type: parsed.type ?? "message"
      };
    } catch {
      return {
        sender: "System",
        content: item,
        timestamp: new Date().toISOString(),
        type: "message"
      };
    }
  } else {
    return {
      sender: item.sender ?? "不明",
      content: item.content ?? "",
      timestamp: item.timestamp ?? new Date().toISOString(),
      type: item.type ?? "message"
    };
  }
};

// ソケットイベントの登録
const registerSocketEvent = () => {
  // 入室イベント受信
  socket.on("enterEvent", (data) => {
    onReceiveEnter(data);
  });

  // 新規投稿受信
  socket.on("publishEvent", (data) => {
    onReceivePublish(data);
  });

  // チャット履歴取得
  socket.emit("getChatHistory", (history) => {
    const normalized = history.map(normalizeChat);
    chatList.push(...normalized);
  });
};

// マウント時にソケットイベントを登録し、入室イベントを送信
onMounted(() => {
  registerSocketEvent();
  socket.emit("enterEvent", null);
});
</script>


<template>
  <v-container class="py-6">
    <!-- タイトル・スレッド一覧 -->
    <v-row class="align-center mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-medium">チャット入力</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right text-start">
        <v-btn color="primary" @click="emit('toggle-thread-list')">
          スレッド一覧
        </v-btn>
      </v-col>
    </v-row>

<!-- 投稿一覧（吹き出し形式） -->
<v-card class="pa-4 mb-6" outlined>
  <h2 class="text-h6 mb-3">投稿一覧</h2>

  <div v-if="chatList.length !== 0">
    <v-row
      v-for="(chat, i) in chatList"
      :key="i"
      class="mb-1"
    >
      <!-- メッセージの表示 -->
      <div v-if="chat.type === 'individual'">
        <v-col cols="12" md="8">
          <v-card
            :color="chat.type === 'memo' ? 'amber-lighten-4' : 'grey-lighten-3'"
            class="pa-3"
            elevation="2"
          >
            <div class="text-caption text-grey-darken-1 mb-1">
              {{ chat.sender }} さん - {{ new Date(chat.timestamp).toLocaleString() }}
            </div>
            <div class="text-body-1">{{ chat.content }}</div>
            <v-btn size="x-small" color="primary" @click="onShowThreadSetting(i)">
              スレッド作成
            </v-btn>
          </v-card>
        </v-col>
      </div>

      <!-- スレッドの表示 -->
      <div v-else-if="chat.type === 'thread'">
        <v-col cols="12" md="8">
          <v-card
            :color="chat.type === 'memo' ? 'amber-lighten-4' : 'grey-lighten-3'"
            class="pa-3"
            elevation="2"
          >
          <div class="text-caption text-grey-darken-1 mb-1">
            スレッド - {{ new Date(chat.messages[0].timestamp).toLocaleString() }}
          </div>
            <div>
            <span class="text-body-1">{{ chat.title }}</span>
            <!-- <v-btn size="small" color="secondary">スレッドを表示</v-btn> -->
          </div>
          <v-btn class="text-right" size="x-small" color="secondary"><i class="fas fa-comments"></i></v-btn>
          </v-card>
        </v-col>
      </div>
    </v-row>
  </div>

  <div v-else class="text-grey">投稿がまだありません</div>
</v-card>


    <!-- 投稿エリア -->
    <v-card class="pa-4 mb-6" outlined>
      <p class="mb-3">ログインユーザ：{{ userName }} さん</p>

      <v-textarea
        v-model="chatContent"
        label="投稿文"
        placeholder="投稿文を入力してください"
        rows="4"
        auto-grow
        variant="outlined"
        class="mb-4"
      ></v-textarea>

      <v-row>
        <v-col cols="auto">
          <v-btn color="success" @click="onPublish">投稿</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- スレッド作成フォーム -->
    <v-card
      v-if="threadButtonStatus.isShow"
      class="pa-4"
      color="grey-lighten-4"
      outlined
    >
      <v-text-field
        v-model="form.threadTitle"
        label="スレッドのタイトル"
        placeholder="スレッドのタイトルを入力"
        variant="outlined"
        class="mb-3"
      ></v-text-field>
      <v-row>
        <v-col cols="auto">
          <v-btn color="success" @click="onCreateThread">スレッドを作成</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="error" @click="onCancelCreateThread">キャンセル</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
