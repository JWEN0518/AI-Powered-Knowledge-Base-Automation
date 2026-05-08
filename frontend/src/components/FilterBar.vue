<template>
  <div class="filter-grid">
    <input
      id="kbSearch"
      data-testid="kb-search"
      v-model="localFilters.search"
      placeholder="Search title/content/source"
      @keyup.enter="applyFilters"
    />

    <input v-model="localFilters.creator" placeholder="Filter by creator email" />
    <input v-model="localFilters.tag" placeholder="Filter by tag" />

    <select v-model="localFilters.status">
      <option value="">All Status</option>
      <option value="Draft">Draft</option>
      <option value="Reviewed">Reviewed</option>
      <option value="Published">Published</option>
    </select>

    <div class="date-filter">
      <label for="dateFrom" class="sr-only">Start Date</label>
      <input v-model="localFilters.dateFrom" id="dateFrom" type="date" title="Start Date (From)" />
    </div>
    <div class="date-filter">
      <label for="dateTo" class="sr-only">End Date</label>
      <input v-model="localFilters.dateTo" id="dateTo" type="date" title="End Date (To)" />
    </div>

    <button id="applyFilterBtn" data-testid="kb-apply-filter" @click="applyFilters">
      Apply Filters
    </button>

    <button class="secondary-btn" @click="clearFilters">Clear Filters</button>
  </div>
</template>

<script>
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
  props: {
    filters: {
      type: Object,
      default: emptyFilters
    }
  },
  emits: ["apply", "clear"],
  data() {
    return {
      localFilters: {
        ...emptyFilters(),
        ...this.filters
      }
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(newValue) {
        this.localFilters = {
          ...emptyFilters(),
          ...newValue
        };
      }
    }
  },
  methods: {
    applyFilters() {
      this.$emit("apply", { ...this.localFilters });
    },
    clearFilters() {
      this.localFilters = emptyFilters();
      this.$emit("clear", { ...this.localFilters });
    }
  }
};
</script>
