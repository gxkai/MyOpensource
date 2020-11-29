<template>
  <div id="app">
    <full-loading :show="fullLoading" :text="loadingText" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Locales } from '@/i18n'
import { useStore } from 'vuex'
import { StateType } from '@types'

const App = defineComponent({
  setup() {
    const store = useStore<StateType>()
    const fullLoading = computed(() => store.state.app.fullLoading)
    const loadingText = computed(() => store.state.app.loadingText)
    const currentLanguage = computed(() => Locales[store.state.app.language])
    return {
      currentLanguage,
      loadingText,
      fullLoading,
      Locales
    }
  }
})
export default App
</script>

<style lang="less" scoped></style>
