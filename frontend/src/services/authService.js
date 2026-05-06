import api from "./api";

export async function loginUser(loginForm) {
  const response = await api.post("/auth/login", loginForm);
  return response.data;
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function loadSession() {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return {
      token: "",
      user: null
    };
  }

  return {
    token,
    user: JSON.parse(savedUser)
  };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
