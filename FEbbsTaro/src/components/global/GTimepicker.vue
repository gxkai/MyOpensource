<template>
  <view class="timepicker">
    <input
      type="number"
      v-model="h"
      class="timepicker__input"
      @input="onChange($event, 'h')"
    />
    <view class="timepicker__colon">:</view>
    <input
      type="number"
      v-model="m"
      class="timepicker__input"
      @change="onChange($event, 'm')"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
    onChange(e, x) {
      this[x] = e.detail.value
      this.$emit('update:modelValue', `${this.h}:${this.m}`)
    }
  }
})
</script>

<style lang="less">
.timepicker {
  display: flex;
  align-items: center;
  &__input {
    width: 20px;
    height: 20px;
    font-size: 16px;
    border: 1px solid #000000;
  }
  &__colon {
    margin: 0 2px;
    font-size: 16px;
  }
}
</style>
