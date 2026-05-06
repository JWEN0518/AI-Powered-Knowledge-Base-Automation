<template>
  <div v-if="isLoginRoute" class="auth-shell">
    <RouterView v-slot="{ Component }">
      <component :is="Component" @login="login" />
    </RouterView>

    <p v-if="message" class="message auth-message" :class="{ error: isError }">
      {{ message }}
    </p>
  </div>

  <div v-else class="page">
    <AppHeader v-if="user" :user="user" @logout="logout" />

    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        v-if="$route.name === 'viewer'"
        :records="records"
        :filters="filters"
        @refresh="fetchRecords"
        @apply-filters="applyFilters"
        @clear-filters="clearFilters"
      />

      <component
        :is="Component"
        v-else-if="$route.name === 'editor'"
        :records="records"
        :filters="filters"
        @create="createRecord"
        @update="updateRecord"
        @delete="deleteRecord"
        @refresh="fetchRecords"
        @apply-filters="applyFilters"
        @clear-filters="clearFilters"
      />

      <component
        :is="Component"
        v-else-if="$route.name === 'reviewer'"
        :records="records"
        @status-change="updateStatus"
        @refresh="fetchRecords"
      />
    </RouterView>

    <p v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </p>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import { loginUser, saveSession, loadSession, clearSession } from "./services/authService";
import { getDefaultRoute } from "./router";
import {
  fetchKnowledgeBaseRecords,
  createKnowledgeBaseRecord,
  updateKnowledgeBaseRecord,
  updateKnowledgeBaseStatus,
  deleteKnowledgeBaseRecord
} from "./services/knowledgeBaseService";

function emptyFilters() {
  return {
    search: "",
    status: "",
    tag: "",
    creator: "",
    dateFrom: "",
    dateTo: ""
  };
}

export default {
  name: "App",
  components: {
    AppHeader
  },
  data() {
    return {
      user: null,
      records: [],
      filters: emptyFilters(),
      message: "",
      isError: false
    };
  },
  computed: {
    isLoginRoute() {
      return this.$route.name === "login";
    }
  },
  async mounted() {
    const session = loadSession();
    this.user = session.user;

    if (this.user) {
      await this.fetchRecords();
    }
  },
  methods: {
    setSuccess(message) {
      this.message = message;
      this.isError = false;
    },
    setError(error, fallbackMessage) {
      this.message = error?.response?.data?.message || error?.message || fallbackMessage;
      this.isError = true;
    },
    async login(loginForm) {
      try {
        const data = await loginUser(loginForm);
        this.user = data.user;
        saveSession(data.token, data.user);
        this.setSuccess("Login successful.");
        await this.fetchRecords();
        await this.$router.push(getDefaultRoute(this.user));
      } catch (error) {
        this.setError(error, "Login failed.");
      }
    },
    async logout() {
      clearSession();
      this.user = null;
      this.records = [];
      this.filters = emptyFilters();
      this.setSuccess("Logged out.");
      await this.$router.push("/login");
    },
    async fetchRecords() {
      try {
        this.records = await fetchKnowledgeBaseRecords(this.filters);
      } catch (error) {
        this.setError(error, "Failed to fetch records.");
      }
    },
    async applyFilters(filters) {
      this.filters = filters;
      await this.fetchRecords();
    },
    async clearFilters(filters) {
      this.filters = filters || emptyFilters();
      await this.fetchRecords();
    },
    async createRecord({ form, selectedFile }) {
      try {
        await createKnowledgeBaseRecord(form, selectedFile);
        this.setSuccess("Draft created successfully.");
        await this.fetchRecords();
      } catch (error) {
        this.setError(error, "Failed to create record.");
      }
    },
    async updateRecord({ id, form, selectedFile }) {
      try {
        await updateKnowledgeBaseRecord(id, form, selectedFile);
        this.setSuccess("Record updated successfully.");
        await this.fetchRecords();
      } catch (error) {
        this.setError(error, "Failed to update record.");
      }
    },
    async updateStatus(id, status) {
      try {
        await updateKnowledgeBaseStatus(id, status, `Reviewer changed status to ${status}`);
        this.setSuccess(`Record status updated to ${status}.`);
        await this.fetchRecords();
      } catch (error) {
        this.setError(error, "Failed to update status.");
      }
    },
    async deleteRecord(id) {
      const confirmed = confirm("Delete this record?");
      if (!confirmed) return;

      try {
        await deleteKnowledgeBaseRecord(id);
        this.setSuccess("Record deleted successfully.");
        await this.fetchRecords();
      } catch (error) {
        this.setError(error, "Failed to delete record.");
      }
    }
  }
};
</script>
