import api from "./axios";

type UpdateProfilePayload = {
  username?: string;
  address?: string;
  profileImage?: string;
  removeProfileImage?: boolean;
};

type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const getCustomerProfile = async () => {
  return await api.get("/customer/profile");
};

export const updateCustomerProfile = async (payload: UpdateProfilePayload) => {
  return await api.put("/customer/profile", payload);
};

export const updateCustomerPassword = async (payload: UpdatePasswordPayload) => {
  return await api.put("/customer/profile/password", payload);
};
