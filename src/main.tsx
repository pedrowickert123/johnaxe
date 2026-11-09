import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);

// Admin (and supabase-js) load only on /admin
if (window.location.pathname.startsWith("/admin")) {
  import("./pages/Admin.tsx").then(({ default: Admin }) =>
    root.render(
      <StrictMode>
        <Admin />
      </StrictMode>,
    ),
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
