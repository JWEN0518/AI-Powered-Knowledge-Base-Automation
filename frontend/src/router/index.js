import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ViewerView from "../views/ViewerView.vue";
import EditorView from "../views/EditorView.vue";
import ReviewerView from "../views/ReviewerView.vue";
import { loadSession } from "../services/authService";

export function getDefaultRoute(user) {
  if (!user) return "/login";

  if (user.role === "Editor") return "/editor";
  if (user.role === "Reviewer") return "/reviewer";

  return "/viewer";
}

const routes = [
  {
    path: "/",
    redirect: () => getDefaultRoute(loadSession().user)
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/viewer",
    name: "viewer",
    component: ViewerView,
    meta: {
      requiresAuth: true,
      roles: ["Viewer"]
    }
  },
  {
    path: "/editor",
    name: "editor",
    component: EditorView,
    meta: {
      requiresAuth: true,
      roles: ["Editor"]
    }
  },
  {
    path: "/reviewer",
    name: "reviewer",
    component: ReviewerView,
    meta: {
      requiresAuth: true,
      roles: ["Reviewer"]
    }
  },
  {
    path: "/dashboard",
    redirect: () => getDefaultRoute(loadSession().user)
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: () => getDefaultRoute(loadSession().user)
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const { user } = loadSession();

  if (to.meta.requiresAuth && !user) {
    return "/login";
  }

  if (to.name === "login" && user) {
    return getDefaultRoute(user);
  }

  if (to.meta.roles && !to.meta.roles.includes(user?.role)) {
    return getDefaultRoute(user);
  }

  return true;
});

export default router;
