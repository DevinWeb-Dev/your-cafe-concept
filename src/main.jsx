import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { CafeProvider } from "./context/CafeContext.jsx";
import CafeLoader from "./components/CafeLoader.jsx";
import CafeErrorBoundary from "./components/CafeErrorBoundary.jsx";
import App from "./App.jsx";

import "./styles/base.css";
import "./styles/public.css";
import "./styles/staff.css";
import "./styles/final-polish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
  <CafeProvider>
    <CafeErrorBoundary>
      <CafeLoader />
      <App />
    </CafeErrorBoundary>
  </CafeProvider>
</HashRouter>
);
