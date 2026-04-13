import { API_BASE, USE_MOCK } from "../config/api";

export const login = async (email, password) => {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    return { token };
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Login failed");
  }

  return res.json();
};

export const register = async (name, email, password) => {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists");
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem("mock_users", JSON.stringify(users));
    return { userId: newUser.id };
  }

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Register failed");
  }

  return res.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  if (USE_MOCK) {
    const decoded = JSON.parse(atob(token));
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find((u) => u.id === decoded.userId);
    return user
      ? { id: user.id, name: user.name, email: user.email, role: "user" }
      : { id: decoded.userId, name: "Demo User", email: decoded.email, role: "user" };
  }

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};