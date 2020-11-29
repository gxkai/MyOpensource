<template>
  <label :for="id" class="checkbox">
    <input
      type="checkbox"
      :id="id"
      v-model="val"
      :value="value"
      @change="onChange"
    />
    <span></span>
    <label>{{ label }}</label>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { uuid } from '@/utils/common'

export default defineComponent({
  props: {
    modelValue: [Array, Boolean],
    value: String,
    label: String
  },
  data(vm) {
    return {
      val: this.modelValue,
      id: uuid()
    }
  },
  watch: {
    modelValue(val: any) {
      this.val = val
    }
  },
  methods: {
    onChange() {
      this.$emit('update:modelValue', this.val)
    }
  }
})
</script>

<style lang="less" scoped>
.checkbox {
  display: flex;
  align-items: center;
  label {
    margin-left: 10px;
  }
  input[type='checkbox'] {
    display: none;
  }
  input[type='checkbox'] + span {
    width: 20px;
    height: 20px;
    border: 1px solid #000000;
    display: inline-block;
    border-radius: 50%;
  }
  input[type='checkbox']:checked + span {
    background-color: #0058a3;
  }
}
</style>
