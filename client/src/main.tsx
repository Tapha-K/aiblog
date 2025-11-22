import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GitHubProvider } from "./views/contexts/GitHubContext.tsx";
import { SavedPostProvider } from "./views/contexts/SavedPostContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <GitHubProvider>
                <SavedPostProvider>
                    <App />
                </SavedPostProvider>
            </GitHubProvider>
        </BrowserRouter>
    </React.StrictMode>
);
