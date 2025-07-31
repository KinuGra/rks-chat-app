<script setup>
import { reactive } from 'vue';

const chatHistory = reactive([
    {
        id: 0,
        content: "こんにちは",
        timestamp: new Date(),
        sender: "山田",
        type: "individual",
    },
    {
        id: 1,
        title: "数学",
        tags: ["タグ1", "タグ2"],
        messages: [
            {
                id: 1,
                content: "数学のメモ",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 2,
                content: "青チャート",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    },
    {
        id: 3,
        title: "英語の講義",
        tags: ["タグ1", "タグ2"],
        messages: [
            {
                id: 3,
                content: "メモ1",
                timestamp: new Date(),
                sender: "村田",
            },
            {
                id: 4,
                content: "英語メモ",
                timestamp: new Date(),
                sender: "山田",
            }
        ],
        type: "thread"
    }
])
</script>

<template>
    <v-btn>絞り込み</v-btn>
    <v-btn>❌</v-btn>
    <p>スレッド一覧</p>
    <div v-for="(chat, i) in chatHistory.slice().reverse()" :key="chat.id">
        <ul v-if="chat.type === 'thread'">
            <li>
                {{ chat.title }}
                <span v-for="(tag, i) in chat.tags" :key="chat.id">
                    {{ tag }}
                </span>
                <ul><li :style="{ marginLeft: '10px' }">{{ chat.messages[0].content }}</li></ul>
            </li>
        </ul>
    </div>
</template>