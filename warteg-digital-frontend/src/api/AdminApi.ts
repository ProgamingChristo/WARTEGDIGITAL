import api from "./axios";

export const loginAdmin = async (username: string, password: string) => {
  const res = await api.post("/admin/login", { username, password });
  return res.data; // { token, data: admin }
};

export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const updateAdminProfile = async (payload: {
  username?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}) => {
  const res = await api.put("/admin/profile", payload);
  return res.data;
};
