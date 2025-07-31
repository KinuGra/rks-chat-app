<script setup>
import { ref, reactive } from 'vue';
import FilterModal from './FilterModal.vue';
import { initChatData } from './dummyData.js';
import socketManager from "../../socketManager.js";
import { onMounted } from 'vue';

const emit = defineEmits(['select-thread'])

// ThreadList/dummyData.jsから読み込む場合
// const chatHistory = reactive(initChatData)

// サーバーサイドからデータを読み込む場合
const chatHistory = reactive([])

// WebSocket処理
const socket = socketManager.getInstance();
onMounted(() => {
    registerSocketEvent();
    socket.emit("plzData", null);
})
// メッセージデータ受け取り
const registerSocketEvent = () => {
    socket.on("plzData", (data) => {
        chatHistory.splice(0);
        chatHistory.push(...data);
        console.log(chatHistory)
    })
}

// 選択したスレッドをPropsで引き渡す用
defineProps({
  threads: {
    type: Array,
    required: true
  }
})

const isShowFilterModal = ref(false);
const showModal = () => {
    isShowFilterModal.value = true;
}

// 絞り込みようのfilterTag更新
const handleUpdate = (tag) => {
    filterTag.value = tag;
    console.log(filterTag.value + "で絞り込みます")
}

const filterTag = ref("全スレッド");
</script>

<template>
    <v-btn @click="showModal">絞り込み</v-btn>
    <v-btn>❌</v-btn>
    <p>スレッド一覧</p>

    <!-- フィルターモーダル -->
    <div v-if="isShowFilterModal === true" class="modal-wrapper">
        <FilterModal @update="handleUpdate"/>
    </div>

    <!-- 全スレッド -->
    <div v-for="(chat, i) in chatHistory.slice().reverse()" :key="chat.id">
        <ul v-if="chat.type === 'thread' && filterTag === '全スレッド'">
            <li @click="emit('select-thread', chat)" style="cursor: pointer;">
                {{ chat.title }}
                <span v-for="(tag, i) in chat.tags" :key="chat.id">
                    {{ tag }}
                </span>
                <ul><li :style="{ marginLeft: '10px' }">{{ chat.messages[0].content }}</li></ul>
            </li>
        </ul>
    </div>

    <!-- タグによる絞り込み -->
    <div v-for="(chat, i) in chatHistory.slice().reverse()" :key="chat.id">
        <ul v-if="chat.type === 'thread' && filterTag !== '全スレッド' && chat.tags.includes(filterTag)">
            <li @click="emit('select-thread', chat)" style="cursor: pointer;">
                {{ chat.title }}
                <span v-for="(tag, i) in chat.tags" :key="chat.id">
                    {{ tag }}
                </span>
                <ul><li :style="{ marginLeft: '10px' }">{{ chat.messages[0].content }}</li></ul>
            </li>
        </ul>
    </div>
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