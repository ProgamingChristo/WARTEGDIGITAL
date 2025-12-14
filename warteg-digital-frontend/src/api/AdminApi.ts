import api from "./axios";

export const loginAdmin = async (username: string, password: string) => {
  const res = await api.post("/admin/login", { username, password });
  return res.data; // { token, data: admin }
};
