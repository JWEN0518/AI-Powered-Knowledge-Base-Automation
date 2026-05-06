<template>
  <div>
    <KnowledgeForm
      v-model="form"
      :is-edit-mode="isEditMode"
      @submit="handleSubmit"
      @clear="resetEditorForm"
      @file-change="selectedFile = $event"
    />

    <section class="card">
      <div class="section-header">
        <div>
          <h2>Editor Workspace</h2>
          <p class="hint">
            Editor can view, search, filter, create, update, and delete knowledge records in one page.
          </p>
        </div>
        <button @click="$emit('refresh')">Refresh</button>
      </div>

      <FilterBar
        :filters="filters"
        @apply="$emit('apply-filters', $event)"
        @clear="$emit('clear-filters', $event)"
      />

      <p v-if="records.length === 0" class="empty">No records found.</p>

      <RecordCard
        v-for="record in records"
        :key="record._id"
        :record="record"
        :can-edit="true"
        :can-review="false"
        :can-delete="true"
        @edit="editRecord"
        @delete="$emit('delete', $event)"
      />
    </section>
  </div>
</template>

<script>
import KnowledgeForm from "../components/KnowledgeForm.vue";
import FilterBar from "../components/FilterBar.vue";
import RecordCard from "../components/RecordCard.vue";

function defaultForm() {
  return {
    title: "",
    content: "",
    category: "Auto Imported",
    sourceFile: "",
    tags: ""
  };
}

export default {
  components: {
    KnowledgeForm,
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
  emits: ["create", "update", "delete", "refresh", "apply-filters", "clear-filters"],
  data() {
    return {
      form: defaultForm(),
      selectedFile: null,
      editingId: null,
      isEditMode: false
    };
  },
  methods: {
    handleSubmit({ form, selectedFile }) {
      if (this.isEditMode) {
        this.$emit("update", {
          id: this.editingId,
          form,
          selectedFile
        });
      } else {
        this.$emit("create", {
          form,
          selectedFile
        });
      }

      this.resetEditorForm();
    },
    editRecord(record) {
      this.editingId = record._id;
      this.isEditMode = true;
      this.selectedFile = null;
      this.form = {
        title: record.title || "",
        content: record.content || "",
        category: record.category || "Auto Imported",
        sourceFile: record.sourceFile || "",
        tags: Array.isArray(record.tags) ? record.tags.join(", ") : ""
      };

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    resetEditorForm() {
      this.form = defaultForm();
      this.selectedFile = null;
      this.editingId = null;
      this.isEditMode = false;
    }
  }
};
</script>
