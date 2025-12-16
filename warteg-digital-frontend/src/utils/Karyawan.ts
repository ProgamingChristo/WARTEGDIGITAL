// src/types/karyawan.ts
export interface Karyawan {
  _id: string;
  name: string;
  username: string;
  position: "dapur" | "kasir";
  shift: "pagi" | "siang" | "malam";
  role: string;
}

export interface KaryawanFormData {
  name: string;
  username: string;
  password?: string;
  position: "dapur" | "kasir";
  shift: "pagi" | "siang" | "malam";
}
