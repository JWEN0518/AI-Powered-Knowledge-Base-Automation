<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h2>Viewer Page</h2>
        <p class="hint">Search and filter records by tag, date, creator, and status.</p>
      </div>
      <button @click="$emit('refresh')">Refresh</button>
    </div>

    <FilterBar :filters="filters" @apply="$emit('apply-filters', $event)" @clear="$emit('clear-filters', $event)" />

    <p v-if="records.length === 0" class="empty">No records found.</p>

    <RecordCard
      v-for="record in records"
      :key="record._id"
      :record="record"
      :can-edit="false"
      :can-review="false"
      :can-delete="false"
    />
  </section>
</template>

<script>
import FilterBar from "../components/FilterBar.vue";
import RecordCard from "../components/RecordCard.vue";

export default {
  components: {
    FilterBar,
    RecordCard
  },
  props: {
    records: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  emits: ["refresh", "apply-filters", "clear-filters"]
};
</script>
