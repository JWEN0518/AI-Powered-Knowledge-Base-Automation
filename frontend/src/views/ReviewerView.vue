<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h2>Reviewer Workspace</h2>
        <p class="hint">Reviewer can mark Draft as Reviewed and Reviewed as Published.</p>
      </div>
      <button @click="$emit('refresh')">Refresh</button>
    </div>

    <p v-if="reviewRecords.length === 0" class="empty">
      No records waiting for review or publish.
    </p>

    <RecordCard
      v-for="record in reviewRecords"
      :key="record._id"
      :record="record"
      :can-edit="false"
      :can-review="true"
      :can-delete="false"
      @status-change="(id, status) => $emit('status-change', id, status)"
    />
  </section>
</template>

<script>
import RecordCard from "../components/RecordCard.vue";

export default {
  components: {
    RecordCard
  },
  props: {
    records: {
      type: Array,
      required: true
    }
  },
  emits: ["status-change", "refresh"],
  computed: {
    reviewRecords() {
      return this.records.filter((record) => record.status === "Draft" || record.status === "Reviewed");
    }
  }
};
</script>
