<template>
  <v-card
    width="300"
    height="175"
    :color="color"
    theme="light"
    class="best-friend-card"
    @click="emits('select-friend', id)"
  >
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <div>Пол: {{ sexName }}</div>
          <div>Возраст: {{ age }}</div>
          <div>Друзья: {{ friendsCount }}</div>
        </v-card-text>
      </div>

      <v-avatar
        class="ma-3"
        size="50px"
        rounded="0"
      >
        <v-img :src="avatar"></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  id: Number,
  color: String,
  title: String,
  sexName: String,
  age: String,
  friendsCount: Number,
  avatar: String
})
const emits = defineEmits(['select-friend'])
</script>
<style scoped>
.best-friend-card {
  margin: 3px;
  cursor: pointer;
}
</style>
