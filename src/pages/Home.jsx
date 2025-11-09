import React from "react";
import "../index.css";

export default function Home() {
    const user = sessionStorage.getItem("loggedUser");

    // ha nincs bejelentkezve, visszadobjuk loginra
    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div className="main-content">
            <h2>Üdv újra, {user}!</h2>
        </div>
    );
}
