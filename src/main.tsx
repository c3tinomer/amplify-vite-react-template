import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Provide the required props to App
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App 
      pageProps={{}} 
      Component={() => <div>Welcome!</div>} 
      router={{} as any} // Provide a mock router object
    />
  </React.StrictMode>
);
