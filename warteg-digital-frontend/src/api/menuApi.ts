import api from "./axios";
import type { MenuType } from "../utils/types";

export const getMenus = async (): Promise<MenuType[]> => {
  const res = await api.get("/customer/menu");
  console.log("API Menu Response:", res.data);

  // ⬇️ ambil array-nya
  const list = res.data?.data;
  return Array.isArray(list) ? list : [];
};