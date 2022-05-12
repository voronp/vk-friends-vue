<template>
  <div class="d-flex flex-column justify-start align-center h-100 w-100">
    <div class="align-self-stretch">
      <v-autocomplete
        v-model="select"
        v-model:search-input="search"
        :loading="loading"
        :items="items"
        cache-items
        flat
        label="Search user:"
        return-object
        multiple
        chips
        closable-chips
        @input="input"
      ></v-autocomplete>
    </div>
    <div style="padding: 10px;">
      <v-btn @click="build" :loading="isBuildLoading">Build</v-btn>
    </div>
    <v-progress-circular
      v-if="isBuildLoading"
      indeterminate
    ></v-progress-circular>
    <div v-else class="align-self-stretch d-flex flex-wrap justify-center align-center">
      <base-friend-card
        :key="card.id"
        v-for="card in friendCards"
        v-bind="card"
        @select-friend="onFriendSelect"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BaseFriendCard from '@/components/BaseFriendCard'

const store = useStore()
const router = useRouter()
const items = computed(() => store.getters['search/autocompleteItems'])
const search = ref('')
const loading = computed(() => store.state.search.status === 'loading')
const input = (event) => {
  search.value = event.target.value
}
watch(() => search.value, () => {
  if (search.value.length > 2) {
    store.dispatch('search/searchUserVK', search.value)
  }
})
const select = computed({
  get: () => {
    return store.state.search.selected
  },
  set: (v) => {
    store.commit('search/setSelected', v)
  }
})
const isBuildLoading = ref(false)
const build = async () => {
  isBuildLoading.value = true
  await Promise.all(store.state.search.selected.map(v => {
    const id = store.getters['search/itemsDict'][v].id
    return store.dispatch('friends/getFriendsVK', id)
  }))
  isBuildLoading.value = false
}
const getCardColor = (friend) => {
  const limit = 10
  const opacity = Math.min((friend.friendsCount - 1) / limit, 1)
  return `rgba(255,0,0,${opacity})`
}
const friendCards = computed(() => {
  return Object.values(store.getters['friends/allFriends']).map(f => ({
    id: f.id,
    color: getCardColor(f),
    title: `${f.first_name} ${f.last_name}`,
    sexName: f.sexName,
    age: f.age,
    friendsCount: f.friendsCount,
    avatar: f.photo_50
  })).sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)
})
const onFriendSelect = (id) => {
  router.push(`/friend/${id}`)
}
</script>
