// src/pages/admin/karyawan/types.ts
export interface Karyawan {
  _id: string;
  name: string;
  username: string;
  position: "kasir" | "dapur";
  shift: "pagi" | "siang" | "malam";
  role: string;
  attendance: {
    status: string;
    date: string;
  }[];
  createdAt: string;
}
