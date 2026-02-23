// src/types/karyawan.ts
export interface Karyawan {
  _id: string;
  name: string;
  username: string;
  position: "dapur" | "kasir";
  shift: "pagi" | "siang" | "malam";
  role: string;
  attendance: {
    date: string;
    status: "hadir" | "izin" | "alpha" | string;
  }[];
  createdAt: string;
}

export interface KaryawanFormData {
  name: string;
  username: string;
  password?: string;
  position: "dapur" | "kasir";
  shift: "pagi" | "siang" | "malam";
}
