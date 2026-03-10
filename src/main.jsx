import React from "react";
import { createRoot } from "react-dom/client";
import { Runner } from "./runner.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Runner />
  </React.StrictMode>,
);

