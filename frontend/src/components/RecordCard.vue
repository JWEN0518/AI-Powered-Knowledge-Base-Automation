<template>
  <article class="record" :data-source-file="record.sourceFile">
    <div class="record-header">
      <div>
        <h3>{{ record.title }}</h3>

        <p v-if="record.aiGenerated" class="ai-label">
          AI-enhanced draft
        </p>

        <p class="meta source-file-marker" :id="'source-' + record._id">
          SourceFile: {{ record.sourceFile || "Manual input" }}
        </p>

        <p class="meta">
          Status: <StatusBadge :status="record.status" />
          | Category: {{ record.category }}
          | Source: {{ record.sourceFile || "Manual input" }}
          | Tags: {{ tagText }}
        </p>

        <p v-if="hasUploadedFile" class="meta uploaded-file-row">
          Uploaded File:
          <a :href="uploadedFileUrl" target="_blank" rel="noopener noreferrer">
            {{ record.uploadedFile.originalName }}
          </a>
          <span v-if="record.uploadedFile.size">
            ({{ formatFileSize(record.uploadedFile.size) }})
          </span>
        </p>

        <div v-if="isImageFile" class="file-preview">
          <img :src="uploadedFileUrl" :alt="record.uploadedFile.originalName" />
        </div>

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
          <span v-if="version.uploadedFile?.originalName">
            | File: {{ version.uploadedFile.originalName }}
          </span>
        </li>
      </ul>
    </details>
  </article>
</template>

<script>
import StatusBadge from "./StatusBadge.vue";

const API_ORIGIN = "http://localhost:5000";

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
    },
    hasUploadedFile() {
      return Boolean(this.record.uploadedFile?.url);
    },
    uploadedFileUrl() {
      const url = this.record.uploadedFile?.url || "";
      if (!url) return "";
      return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
    },
    isImageFile() {
      return Boolean(this.record.uploadedFile?.mimeType?.startsWith("image/"));
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return "N/A";
      return new Date(value).toLocaleString();
    },
    formatFileSize(size) {
      if (!size) return "0 B";
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  }
};
</script>

<style scoped>
.ai-label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ede9fe;
  color: #5b21b6;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
