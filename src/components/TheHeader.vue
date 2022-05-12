<template>
    <v-toolbar
      dark
      prominent
    >

      <v-toolbar-title>VK Friends</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="isLoggedIn" @click="logout()">
        {{ userName }}
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn v-else icon @click="login()">
        <v-icon>mdi-import</v-icon>
      </v-btn>
    </v-toolbar>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
const userName = computed(() => `${store.state.auth.user.first_name} ${store.state.auth.user.last_name}`)
const logout = () => store.dispatch('auth/logoutVK')
const login = () => store.dispatch('auth/loginVK')
</script>
