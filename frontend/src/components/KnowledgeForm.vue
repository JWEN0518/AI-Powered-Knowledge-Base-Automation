<template>
  <section class="card">
    <h2>{{ isEditMode ? "Update Knowledge Base Record" : "Upload Console" }}</h2>
    <p class="hint">
      Editor can create or update records. New records are saved as Draft for reviewer checking.
    </p>

    <form class="form" @submit.prevent="submitForm">
      <label>Title</label>
      <input
        id="title"
        data-testid="kb-title"
        v-model="localForm.title"
        type="text"
        placeholder="Enter title"
        required
      />

      <label>Content</label>
      <textarea
        id="content"
        data-testid="kb-content"
        v-model="localForm.content"
        rows="8"
        placeholder="Enter content manually or upload a file below"
      ></textarea>

      <div class="form-grid">
        <div>
          <label>Category</label>
          <input
            id="category"
            data-testid="kb-category"
            v-model="localForm.category"
            type="text"
            placeholder="Auto Imported"
          />
        </div>

        <div>
          <label>Source File</label>
          <input
            id="sourceFile"
            data-testid="kb-source"
            v-model="localForm.sourceFile"
            type="text"
            placeholder="source filename"
          />
        </div>

        <div>
          <label>Tags</label>
          <input
            id="tags"
            data-testid="kb-tags"
            v-model="localForm.tags"
            type="text"
            placeholder="sop, delivery, invoice"
          />
        </div>

        <div>
          <label>Status</label>
          <input value="Draft" disabled />
          <small>Only Reviewer can mark Reviewed or Published.</small>
        </div>
      </div>

      <label>Upload File</label>
      <input
        id="fileUpload"
        type="file"
        accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.msg"
        @change="handleFileChange"
      />

      <div class="button-row">
        <button
          :id="isEditMode ? 'updateBtn' : 'saveBtn'"
          :data-testid="isEditMode ? 'kb-update' : 'kb-save'"
          type="submit"
        >
          {{ isEditMode ? "Update Record" : "Save Draft" }}
        </button>

        <button type="button" class="secondary-btn" @click="clearForm">
          Clear Form
        </button>
      </div>
    </form>
  </section>
</template>

<script>
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
  props: {
    modelValue: {
      type: Object,
      default: defaultForm
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["submit", "clear", "update:modelValue", "file-change"],
  data() {
    return {
      localForm: {
        ...defaultForm(),
        ...this.modelValue
      },
      selectedFile: null
    };
  },
  watch: {
    modelValue: {
      deep: true,
      handler(newValue) {
        this.localForm = {
          ...defaultForm(),
          ...newValue
        };
      }
    },
    localForm: {
      deep: true,
      handler(newValue) {
        this.$emit("update:modelValue", { ...newValue });
      }
    }
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0] || null;

      if (this.selectedFile && !this.localForm.title) {
        this.localForm.title = this.selectedFile.name.replace(/\.[^/.]+$/, "");
      }

      if (this.selectedFile) {
        this.localForm.sourceFile = this.selectedFile.name;
      }

      this.$emit("file-change", this.selectedFile);
    },
    submitForm() {
      this.$emit("submit", {
        form: { ...this.localForm },
        selectedFile: this.selectedFile
      });
    },
    clearForm() {
      this.selectedFile = null;
      this.localForm = defaultForm();

      const fileInput = document.getElementById("fileUpload");
      if (fileInput) fileInput.value = "";

      this.$emit("file-change", null);
      this.$emit("clear");
    }
  }
};
</script>
