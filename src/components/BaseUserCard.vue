<template>
  <v-card
    width="300"
    height="175"
    theme="light"
    class="base-user-card"
  >
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title class="text-h5" data-test="title">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <div>Пол: {{ sexName }}</div>
          <div>Возраст: {{ age }}</div>
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
import { defineProps } from 'vue'

const props = defineProps({
  id: Number,
  title: String,
  sexName: String,
  age: String,
  avatar: String
})
</script>
<style scoped>
  .base-user-card {
    margin: 3px;
  }
</style>
