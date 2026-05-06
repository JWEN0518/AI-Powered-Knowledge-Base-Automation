<template>
  <div class="login-page">
    <div class="login-layout">
      <section class="login-info-panel">
        <div class="brand-badge">DHL DAC 3.0</div>

        <h1>DHL Knowledge Base System</h1>
        <p>
          Secured RPA-ready knowledge base web application for managing
          imported logistics knowledge articles.
        </p>

        <div class="login-feature-list">
          <div class="feature-item">
            <span>01</span>
            <p>Editors can create, edit, update, and delete draft articles.</p>
          </div>

          <div class="feature-item">
            <span>02</span>
            <p>Reviewers can review articles and update publication status.</p>
          </div>

          <div class="feature-item">
            <span>03</span>
            <p>Viewers can search and filter published knowledge records.</p>
          </div>
        </div>
      </section>

      <section class="login-card">
        <div class="login-card-header">
          <h2>Welcome Back</h2>
          <p>Login as Editor, Reviewer, or Viewer.</p>
        </div>

        <form class="form" @submit.prevent="submitLogin">
          <div class="input-group">
            <label for="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              v-model="loginForm.email"
              type="email"
              placeholder="editor@dhl.local"
              required
            />
          </div>

          <div class="input-group">
            <label for="loginPassword">Password</label>
            <input
              id="loginPassword"
              v-model="loginForm.password"
              type="password"
              placeholder="Editor12345"
              required
            />
          </div>

          <button id="loginBtn" class="login-button" type="submit">
            Login to System
          </button>
        </form>

        <div class="demo-box">
          <p class="demo-title">Demo Accounts</p>
          <p><b>Editor:</b> editor@dhl.local / Editor12345</p>
          <p><b>Reviewer:</b> reviewer@dhl.local / Reviewer12345</p>
          <p><b>Viewer:</b> viewer@dhl.local / Viewer12345</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["login"],
  data() {
    return {
      loginForm: {
        email: "editor@dhl.local",
        password: "Editor12345"
      }
    };
  },
  methods: {
    submitLogin() {
      this.$emit("login", { ...this.loginForm });
    }
  }
};
</script>