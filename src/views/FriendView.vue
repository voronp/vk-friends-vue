<template>
  <div class="d-flex flex-column justify-start align-center h-100 w-100 friend-view">
    <h1>{{ title }}</h1>
    <div style="padding: 10px;">
      <v-btn @click="back">Back</v-btn>
    </div>
    <div class="d-flex flex-wrap justify-center align-center">
      <base-user-card
        :key="card.id"
        v-for="card in users"
        v-bind="card"
      />
    </div>
    <v-progress-circular
      v-if="isWallLoading"
      indeterminate
    ></v-progress-circular>
    <div v-else class="align-self-stretch d-flex flex-nowrap justify-center align-center flex-column">
      <div v-for="record in wallItems" :key="record.id" class="friend-view__wall-item">{{ record.text }}</div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import BaseUserCard from '@/components/BaseUserCard'
import { getSexName, bdateToAge } from '@/utils'

const store = useStore()
const router = useRouter()
const route = useRoute()
const friend = computed(() => {
  return store.getters['friends/allFriends'][route.params.id]
})
const users = computed(() => {
  const dict = store.state.search.items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
  return friend.value.friendIds.map(id => ({
    id,
    title: `${dict[id].first_name} ${dict[id].last_name}`,
    sexName: getSexName(dict[id].sex),
    age: bdateToAge(dict[id].bdate),
    avatar: dict[id].photo_50
  }))
})
const title = computed(() => `${friend.value.first_name} ${friend.value.last_name}`)
const isWallLoading = ref(true)
const loadWall = async () => {
  isWallLoading.value = true
  await store.dispatch('wall/getWallVK', route.params.id)
  isWallLoading.value = false
}
const back = () => router.back()
const wallItems = computed(() => store.state.wall.items)
loadWall()

</script>
<style lang="scss" scoped>
.friend-view {
  h1 {
    font-size: 1.2em;
  }
  &__wall-item {
    border-bottom: 1px solid silver;
    padding: 10px;
  }
}
</style>
