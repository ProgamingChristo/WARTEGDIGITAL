export const loadSnapScript = (): Promise<void> => {
  return new Promise((resolve) => {
    const existing = document.getElementById("snap-script");

    if (existing) return resolve();

    const script = document.createElement("script");
    script.id = "snap-script";
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};
