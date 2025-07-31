<script setup>
import { defineEmits } from 'vue';
import { tagsData } from './tagsData';

// updateというイベントを宣言
const emit = defineEmits(['update'])

// 親にイベントを送る関数
const sendtoParent = (tag) => {
    emit('update', tag)
}
</script>

<template>
    <div v-for="(tag, i) in tagsData">
        <div @click="sendtoParent(tag)">{{ tag }}</div>
    </div>
</template>