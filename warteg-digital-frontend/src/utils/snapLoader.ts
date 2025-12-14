// utils/snapLoader.ts
export default function loadSnap() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
