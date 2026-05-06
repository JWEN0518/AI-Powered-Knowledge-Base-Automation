<template>
  <header class="topbar">
    <div>
      <h1>DHL Knowledge Base System</h1>
      <p>Secured RPA-ready knowledge base web application</p>

      <nav v-if="user" class="route-nav">
        <RouterLink :to="homeRoute">{{ navLabel }}</RouterLink>
      </nav>
    </div>

    <div v-if="user" class="user-box">
      <p><b>{{ user.name }}</b></p>
      <p>{{ user.email }} | {{ user.role }}</p>
      <button class="logout-btn" @click="$emit('logout')">Logout</button>
    </div>
  </header>
</template>

<script>
import { getDefaultRoute } from "../router";

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ["logout"],
  computed: {
    homeRoute() {
      return getDefaultRoute(this.user);
    },
    navLabel() {
      if (this.user.role === "Editor") return "Editor Workspace";
      if (this.user.role === "Reviewer") return "Reviewer Workspace";
      return "Viewer Page";
    }
  }
};
</script>
