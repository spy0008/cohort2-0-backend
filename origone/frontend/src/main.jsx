import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/app.store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      }}
    />
    <App />
  </Provider>,
);
