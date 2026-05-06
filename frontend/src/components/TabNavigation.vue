<template>
  <nav class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="tab-btn"
      :class="{ active: modelValue === tab.key }"
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue"]
};
</script>
