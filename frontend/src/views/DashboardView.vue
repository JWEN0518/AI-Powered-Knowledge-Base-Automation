<template>
  <main>
    <TabNavigation v-model="activeTab" :tabs="availableTabs" />

    <ViewerView
      v-if="activeTab === 'viewer'"
      :records="records"
      :filters="filters"
      @refresh="$emit('refresh')"
      @apply-filters="$emit('apply-filters', $event)"
      @clear-filters="$emit('clear-filters', $event)"
    />

    <EditorView
      v-if="activeTab === 'editor'"
      :records="records"
      @create="$emit('create', $event)"
      @update="$emit('update', $event)"
      @delete="$emit('delete', $event)"
      @refresh="$emit('refresh')"
    />

    <ReviewerView
      v-if="activeTab === 'reviewer'"
      :records="records"
      @status-change="(id, status) => $emit('status-change', id, status)"
      @refresh="$emit('refresh')"
    />
  </main>
</template>

<script>
import TabNavigation from "../components/TabNavigation.vue";
import ViewerView from "./ViewerView.vue";
import EditorView from "./EditorView.vue";
import ReviewerView from "./ReviewerView.vue";

export default {
  components: {
    TabNavigation,
    ViewerView,
    EditorView,
    ReviewerView
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    records: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  emits: [
    "refresh",
    "apply-filters",
    "clear-filters",
    "create",
    "update",
    "delete",
    "status-change"
  ],
  data() {
    return {
      activeTab: "viewer"
    };
  },
  computed: {
    availableTabs() {
      const tabs = [{ key: "viewer", label: "Viewer Page" }];

      if (this.user.role === "Editor") {
        tabs.push({ key: "editor", label: "Editor Workspace" });
      }

      if (this.user.role === "Reviewer") {
        tabs.push({ key: "reviewer", label: "Reviewer Workspace" });
      }

      return tabs;
    }
  },
  watch: {
    availableTabs: {
      immediate: true,
      handler(tabs) {
        if (!tabs.some((tab) => tab.key === this.activeTab)) {
          this.activeTab = tabs[0].key;
        }
      }
    }
  }
};
</script>
