<template>
  <span class="status" :class="statusClass">
    {{ status }}
  </span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    statusClass() {
      return this.status.toLowerCase();
    }
  }
};
</script>
