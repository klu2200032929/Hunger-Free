import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@picocss/pico/css/pico.min.css";


// Create a root element and render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
