import React, { useState } from "react";
import icon from "../images/icon.png";
import { useNavigate } from "react-router-dom";

import "../index.css";

export default function Login() {
    // Panel állapot: false = bejelentkezés, true = regisztráció
    const [isSignup, setIsSignup] = useState(false);
    // Hibák külön tárolva, hogy melyik panelen mit írjunk ki
    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    // Beépített admin felhasználó (hardcoded)
    const ADMIN = { username: "admin", password: "admin" };

    // --- Segédfüggvények: sessionStorage-ból ki/be ---
    const getUsers = () => JSON.parse(sessionStorage.getItem("users") || "[]");
    const saveUsers = (u) => sessionStorage.setItem("users", JSON.stringify(u));

    // Regisztráció kezelése (users tömbhöz push + ellenőrzés ütközésre)
    const handleSignup = (e) => {
        e.preventDefault();
        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();
        const users = getUsers();

        // Névfoglaltság ellenőrzése (admin név is tiltott)
        if (users.some(u => u.username === username) || username === ADMIN.username) {
            setSignupError("Ez a felhasználónév már foglalt!");
            return;
        }

        // Mentés és rövid visszajelzés
        users.push({ username, password });
        saveUsers(users);
        setSignupError("Sikeres regisztráció! Jelentkezz be.");

        // Kis késleltetés után vissza a login panelre
        setTimeout(() => setIsSignup(false), 1500);
    };

    // Bejelentkezés kezelése (admin vagy regisztrált felhasználó)
    const handleLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();
        const users = getUsers();

        const validAdmin = username === ADMIN.username && password === ADMIN.password;
        const validUser = users.some(u => u.username === username && u.password === password);

        if (validAdmin || validUser) {
            // Beállítjuk az aktív usert és megyünk a Home-ra
            sessionStorage.setItem("loggedUser", username);
            navigate("/Home");
        } else {
            setLoginError("Hibás felhasználónév vagy jelszó!");
        }
    };

    return (
        <div className="login-page">
            <div className="main">
                {/* A panelváltó konténer: .show-signup esetén felül a Signup */}
                <div className={`form-container ${isSignup ? "show-signup" : ""}`}>

                    {/* --- Bejelentkezés panel --- */}
                    <div className="login">
                        <form onSubmit={handleLogin}>
                            <div className="header">
                                <img src={icon} alt="App ikon" className="icon" />
                                <span className="title">Puss in Boots</span>
                            </div>

                            <h2>Bejelentkezés</h2>

                            {/* Felhasználónév + jelszó mezők */}
                            <input type="text" name="username" placeholder="Felhasználónév" required />
                            <input type="password" name="password" placeholder="Jelszó" required />

                            {/* Belépés gomb + hiba */}
                            <button type="submit">Belépés</button>
                            <p className="error-message">{loginError}</p>

                            {/* Átváltás a regisztrációs panelre */}
                            <p className="switch-form" onClick={() => setIsSignup(true)}>
                                Nincs fiókod? Regisztrálj
                            </p>
                        </form>
                    </div>

                    {/* --- Regisztráció panel --- */}
                    <div className="signup">
                        <form onSubmit={handleSignup}>
                            <div className="header">
                                <img src={icon} alt="App ikon" className="icon" />
                                <span className="title">Puss in Boots</span>
                            </div>

                            <h2>Regisztráció</h2>

                            {/* Új felhasználó adatai */}
                            <input type="text" name="username" placeholder="Felhasználónév" required />
                            <input type="password" name="password" placeholder="Jelszó" required />

                            {/* Mentés gomb + hiba */}
                            <button type="submit">Fiók létrehozása</button>
                            <p className="error-message">{signupError}</p>

                            {/* Vissza a bejelentkezéshez */}
                            <p className="switch-form" onClick={() => setIsSignup(false)}>
                                Már van fiókod? Jelentkezz be
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
