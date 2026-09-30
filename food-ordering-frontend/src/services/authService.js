import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.data.token;

  localStorage.setItem("token", token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.data;
};