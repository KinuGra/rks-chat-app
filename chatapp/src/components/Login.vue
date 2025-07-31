<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (inputUserName.value === "") {
    alert("ユーザー名を入力してください。")
    return
  }

  // 入室メッセージを送信
  socket.emit("enterEvent", { userName: inputUserName.value })

  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = inputUserName.value

  // チャット画面へ遷移
  router.push({ name: "chat" })
}
// #endregion
</script>

<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" elevation="10" min-width="300" max-width="500">
      <v-card-title class="text-h5 font-weight-bold">SABI Chat</v-card-title>
      <v-card-subtitle class="text-h6">Summary of Action-Based Insights</v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent="onEnter">
          <v-text-field
            v-model="inputUserName"
            label="ユーザー名"
            outlined
            dense
            required
          ></v-text-field>
          <v-btn
            color="primary"
            class="mt-4"
            type="submit"
            block
          >
            入室する
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}
</style>
