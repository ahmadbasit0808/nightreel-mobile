import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Manually persist and send session cookie
api.interceptors.request.use(async (config) => {
  const cookie = await AsyncStorage.getItem("session_cookie");
  if (cookie) config.headers["Cookie"] = cookie;
  return config;
});

api.interceptors.response.use(async (response) => {
  const setCookie = response.headers["set-cookie"];
  if (setCookie) {
    const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    const sessionPart = cookie.split(";")[0];
    await AsyncStorage.setItem("session_cookie", sessionPart);
  }
  return response;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const moviesAPI = {
  list: (params) => api.get("/movies", { params }),
  top: () => api.get("/movies/top"),
  get: (movieno) => api.get(`/movies/${movieno}`),
};

export const usersAPI = {
  get: (userno) => api.get(`/users/${userno}`),
  getWatchlist: (userno) => api.get(`/users/${userno}/watchlist`),
  getWatched: (userno) => api.get(`/users/${userno}/watched`),
  getReviews: (userno) => api.get(`/users/${userno}/reviews`),
};

export const reviewsAPI = {
  create: (data) => api.post("/reviews", data),
  update: (reviewno, data) => api.put(`/reviews/${reviewno}`, data),
  delete: (reviewno) => api.delete(`/reviews/${reviewno}`),
  markWatched: (movieno) => api.post(`/reviews/${movieno}/watched`),
  unmarkWatched: (movieno) => api.delete(`/reviews/${movieno}/watched`),
  addToWatchlist: (movieno) => api.post(`/reviews/${movieno}/watchlist`),
  removeFromWatchlist: (movieno) => api.delete(`/reviews/${movieno}/watchlist`),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),

  getUsers: (params) => api.get("/admin/users", { params }),

  getMovies: (params) => api.get("/admin/movies", { params }),

  addMovie: (data) => api.post("/admin/movies", data),

  updateMovie: (id, data) => api.put(`/admin/movies/${id}`, data),

  deleteMovie: (id) => api.delete(`/admin/movies/${id}`),

  setUserRole: (id, isadmin) =>
    api.put(`/admin/users/${id}/role`, {
      isadmin,
    }),
};

export default api;
