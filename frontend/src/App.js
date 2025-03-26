import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";  // ✅ Import Navbar
import AppRoutes from "./routes";         // ✅ Import Routes

function App() {
    return (
        <Router>  {/* ✅ Router should wrap the entire app */}
            <Navbar />  {/* ✅ Navbar stays on all pages */}
            <div className="app-container">
                <AppRoutes />
            </div>
        </Router>
    );
}

export default App;
