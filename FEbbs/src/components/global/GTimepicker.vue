<template>
  <div class="timepicker">
    <input
      type="number"
      v-model="h"
      class="timepicker__input"
      @change="onChange"
    />
    <span class="timepicker__colon">:</span>
    <input
      type="number"
      v-model="m"
      class="timepicker__input"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { uuid } from '@/utils/common'

export default defineComponent({
  props: {
    modelValue: String
  },
  data() {
    return {
      h: 0,
      m: 0
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(value) {
        const arr = value.split(':')
        this.h = arr[0]
        this.m = arr[1]
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('update:modelValue', `${this.h}:${this.m}`)
    }
  }
})
</script>

<style lang="less" scoped>
.timepicker {
  display: flex;
  align-items: center;
  &__input {
    width: 40px;
    height: 20px;
  }
  &__colon {
    margin: 0 10px;
  }
}
</style>
