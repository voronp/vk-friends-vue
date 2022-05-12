<template>
  <v-app>
    <the-header />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
import TheHeader from '@/components/TheHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader
  },
  data () {
    return {
      //
    }
  },

  created (): void {
    this.login()
  },

  methods: {
    ...mapActions({
      login: 'auth/loginVK'
    })
  }
})
</script>
