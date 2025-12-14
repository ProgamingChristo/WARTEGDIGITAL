import api from "./axios";

export const registerCustomer = async (data: {
  username: string;
  password: string;
}) => {
  return await api.post("/customer/register", data);
};

export const loginCustomer = async (data: {
  username: string;
  password: string;
}) => {
  return await api.post("/customer/login", data);
};
