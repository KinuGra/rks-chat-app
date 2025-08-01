<script setup>
import { ref } from 'vue'
import { tagsData } from './tagsData'

// 親コンポーネントに選択されたタグを渡す
const emit = defineEmits(['update', 'close'])

const selectedTag = ref(null)

const sendToParent = (tag) => {
    selectedTag.value = tag
    emit('update', tag)
    emit('close')
}
</script>

<template>
    <v-card class="filter-modal-card">
        <!-- ヘッダー -->
        <v-card-title class="d-flex justify-space-between align-center pa-4 bg-secondary text-white">
            <div class="d-flex align-center">
                <v-icon icon="mdi-tag-multiple-outline" class="mr-2" />
                <span class="text-h6 font-weight-bold">タグを選択</span>
            </div>
            <v-btn icon="mdi-close" variant="text" color="white" @click="emit('close')" />
        </v-card-title>

        <!-- タグ一覧 -->
        <v-card-text class="pa-4">
            <v-row dense>
                <v-col v-for="(tag, i) in tagsData" :key="i" cols="12" sm="12" md="12">
                    <v-chip :color="selectedTag === tag ? 'primary' : 'grey-lighten-2'"
                        :variant="selectedTag === tag ? 'flat' : 'outlined'" class="filter-chip"
                        @click="sendToParent(tag)" block>
                        <v-icon start icon="mdi-tag-outline" />
                        {{ tag }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>

    </v-card>
</template>

<style scoped>
.filter-modal-card {
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(135deg, #ffffff, #f7f9fb);
}

.filter-chip {
    width: 100%;
    justify-content: start;
    font-weight: 500;
    transition: 0.2s ease;
}

.filter-chip:hover {
    transform: scale(1.02);
}
</style>
