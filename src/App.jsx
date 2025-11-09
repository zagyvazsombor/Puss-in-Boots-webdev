import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import List from "./pages/List";
import Stats from "./pages/Stats";
import "./index.css";

function AppContent() {
    const user = sessionStorage.getItem("loggedUser");
    const location = useLocation();


    // Navbar csak akkor, ha nem a login oldalon vagyunk
    const showNavbar = location.pathname !== "/login";

    return (
        <>
            {showNavbar && <Navbar />}

            <Routes>
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/list" element={user ? <List /> : <Navigate to="/login" />} />
                <Route path="/stats" element={user ? <Stats /> : <Navigate to="/login" />} />

            </Routes>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
