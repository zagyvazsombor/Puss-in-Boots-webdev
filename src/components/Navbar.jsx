import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/icon.png"; // vagy public/images/icon.png, ha ott van
import "../index.css"; // ha a menü stílusai ott vannak

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("loggedUser");
        navigate("/login");
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="App ikon" className="logo" />
                <h1>Puss in Boots</h1>
            </div>

            <ul className="menu">
                <li>
                    <NavLink to="/home" end>🏠 Kezdőlap</NavLink>
                </li>
                <li>
                    <NavLink to="/list">📝 Termékek</NavLink>
                </li>
                <li>
                    <NavLink to="/stats">📊 Kimutatások</NavLink>
                </li>
                <li>
                    <a href="#" onClick={handleLogout}>🚪 Kilépés</a>
                </li>
            </ul>

        </nav>
    );
}
