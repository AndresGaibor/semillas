import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "./app/providers";
import "./styles.css";

// Capturar el evento beforeinstallprompt de forma global para no perderlo
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
  window.dispatchEvent(new CustomEvent("semillas-beforeinstallprompt"));
});

window.addEventListener("appinstalled", () => {
  (window as any).deferredPrompt = null;
  window.dispatchEvent(new CustomEvent("semillas-appinstalled"));
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>
);
