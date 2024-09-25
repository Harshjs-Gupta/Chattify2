import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import "../public/service-worker.js";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../public/service-worker.js")
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.error("Service Worker registration failed", err));
  });
}
