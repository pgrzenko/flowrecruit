import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Style – trzymajmy spójnie przez alias "@"
import "@/styles/app.css";
import "@/styles/hex.css";
import "@/styles/modal.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
