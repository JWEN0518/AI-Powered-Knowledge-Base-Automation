<template>
  <article class="record" :data-source-file="record.sourceFile">
    <div class="record-header">
      <div>
        <h3>{{ record.title }}</h3>

        <p class="meta source-file-marker" :id="'source-' + record._id">
          SourceFile: {{ record.sourceFile || "Manual input" }}
        </p>

        <p class="meta">
          Status: <StatusBadge :status="record.status" />
          | Category: {{ record.category }}
          | Source: {{ record.sourceFile || "Manual input" }}
          | Tags: {{ tagText }}
        </p>

        <p class="meta">
          Creator: {{ record.creator?.name || "Unknown" }}
          ({{ record.creator?.email || "N/A" }})
          | Created: {{ formatDate(record.createdAt) }}
        </p>
      </div>

      <div class="record-actions">
        <button
          v-if="canEdit"
          :id="'edit-' + record._id"
          data-testid="kb-edit"
          @click="$emit('edit', record)"
        >
          Edit
        </button>

        <button
          v-if="canReview && record.status === 'Draft'"
          @click="$emit('status-change', record._id, 'Reviewed')"
        >
          Mark Reviewed
        </button>

        <button
          v-if="canReview && record.status === 'Reviewed'"
          @click="$emit('status-change', record._id, 'Published')"
        >
          Publish
        </button>

        <button v-if="canDelete" class="delete-btn" @click="$emit('delete', record._id)">
          Delete
        </button>
      </div>
    </div>

    <details>
      <summary>View Content</summary>
      <pre>{{ record.content }}</pre>
    </details>

    <details>
      <summary>Versioning / Status History</summary>

      <h4>Status History</h4>
      <ul>
        <li v-for="(history, index) in record.statusHistory" :key="index">
          {{ history.status }} by {{ history.changedBy?.name || "Unknown" }}
          on {{ formatDate(history.changedAt) }}
          <span v-if="history.note">- {{ history.note }}</span>
        </li>
      </ul>

      <h4>Versions</h4>
      <ul>
        <li v-for="version in record.versions" :key="version.versionNo">
          Version {{ version.versionNo }}: {{ version.status }} updated by
          {{ version.updatedBy?.name || "Unknown" }} on {{ formatDate(version.updatedAt) }}
        </li>
      </ul>
    </details>
  </article>
</template>

<script>
import StatusBadge from "./StatusBadge.vue";

export default {
  components: {
    StatusBadge
  },
  props: {
    record: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canReview: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ["edit", "delete", "status-change"],
  computed: {
    tagText() {
      return this.record.tags?.length ? this.record.tags.join(", ") : "None";
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return "N/A";
      return new Date(value).toLocaleString();
    }
  }
};
</script>
