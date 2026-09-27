import axios from "axios";
import { currentUserId } from "./role-switcher";

export const api = axios.create();

api.interceptors.request.use((config) => {
  config.headers.set("x-user-id", currentUserId());
  return config;
});
