// src/pages/List.jsx
import React, { useEffect, useState } from "react";

// --- Márkaikonok (bundled assetek) ---
import nike from "../images/brands/nike.png";
import adidas from "../images/brands/adidas.png";
import puma from "../images/brands/puma.png";
import reebok from "../images/brands/reebok.png";

import "../index.css";

/* =========================================================
   Terméklista oldal (CRUD + modal)
   - localStorage: shoes
   - lista + hozzáadás + szerkesztés + törlés
   ========================================================= */
export default function List() {
    /* ---------------------------
       Állapotok
       --------------------------- */
    const [shoes, setShoes] = useState([]);           // tárolt cipők
    const [modalOpen, setModalOpen] = useState(false); // modal láthatóság
    const [editIndex, setEditIndex] = useState(null);  // szerkesztett elem indexe (null = új)

    // űrlap alapértékek és állapot
    const defaultForm = { brand: "", subBrand: "", size: "", color: "", price: "" };
    const [formData, setFormData] = useState(defaultForm);

    /* ---------------------------
       Konstansok
       --------------------------- */
    // Előre definiált almárkák
    const subBrandOptions = {
        Nike: ["Air Max", "Jordan", "Dunk", "Cortez"],
        Adidas: ["Ultraboost", "Yeezy", "Samba", "Gazelle"],
        Puma: ["RS-X", "Suede", "Future Rider"],
        Reebok: ["Classic", "Nano", "Zig Kinetica"],
    };

    // Márka → ikon mapping (kisbetűs kulccsal)
    const icons = { nike, adidas, puma, reebok };

    /* ---------------------------
       Side-effectek
       --------------------------- */
    // 1) Lista betöltése localStorage-ból első rendernél
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("shoes") || "[]");
        setShoes(stored);
    }, []);

    // 2) Auth guard: ha nincs bejelentkezve, dobjuk /login-ra
    useEffect(() => {
        const user = sessionStorage.getItem("loggedUser");
        if (!user) window.location.href = "/login";
    }, []);

    /* ---------------------------
       Segédfüggvények
       --------------------------- */
    // Mentés localStorage-ba + state frissítés
    const saveShoes = (list) => {
        localStorage.setItem("shoes", JSON.stringify(list));
        setShoes(list);
    };

    // Form mező változás
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Modal kulturált bezárása + reset
    const closeModal = () => {
        setModalOpen(false);
        setEditIndex(null);
        setFormData(defaultForm);
    };

    // Új cipő mentése vagy meglévő frissítése
    const handleSubmit = (e) => {
        e.preventDefault();

        // ikon kiválasztása (fallback: nike, hogy ne legyen undefined)
        const iconKey = (formData.brand || "").toLowerCase();
        const newShoe = { ...formData, icon: icons[iconKey] || nike };

        const updated = [...shoes];
        if (editIndex !== null) {
            updated[editIndex] = newShoe;   // szerkesztés
        } else {
            updated.push(newShoe);          // új elem
        }

        saveShoes(updated);
        closeModal();
    };

    // Törlés index alapján
    const handleDelete = (index) => {
        const updated = shoes.filter((_, i) => i !== index);
        saveShoes(updated);
    };

    // Szerkesztés indítása
    const handleEdit = (index) => {
        setEditIndex(index);
        setFormData(shoes[index]);
        setModalOpen(true);
    };

    // Az aktuális márkához tartozó almárkák
    const currentSubBrands = subBrandOptions[formData.brand] || [];

    /* ---------------------------
       Render
       --------------------------- */
    return (
        <div className="main-content">
            {/* Fejléc: cím + gomb */}
            <div className="list-header">
                <h2>Termékek</h2>

                {/* Új termék: tiszta űrlap + modal nyitás */}
                <button
                    id="addBtn"
                    onClick={() => {
                        setEditIndex(null);
                        setFormData(defaultForm);
                        setModalOpen(true);
                    }}
                >
                    ➕ Új termék
                </button>
            </div>

            {/* Kártyák rácsban */}
            <div id="shoeContainer" className="shoe-container">
                {shoes.length === 0 ? (
                    <p>Nincs még hozzáadott cipő.</p>
                ) : (
                    shoes.map((shoe, index) => (
                        <div key={index} className="shoe-card">
                            <img src={shoe.icon} alt={shoe.brand} className="brand-icon" />
                            <h3>
                                {shoe.brand} - {shoe.subBrand}
                            </h3>

                            <p>
                                <strong>Méret:</strong> {shoe.size}
                            </p>
                            <p>
                                <strong>Szín:</strong> {shoe.color}
                            </p>
                            <p className="shoe-price">
                                <strong>Ár:</strong> {shoe.price} Ft
                            </p>

                            <div className="actions">
                                <button onClick={() => handleEdit(index)}>✏️</button>
                                <button onClick={() => handleDelete(index)}>🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: hozzáadás / szerkesztés */}
            {modalOpen && (
                <div
                    className="modal"
                    // háttérre katt → kulturált bezárás + reset
                    onClick={(e) => {
                        if (e.target.classList.contains("modal")) closeModal();
                    }}
                >
                    <div className="modal-content">
                        <h3>{editIndex !== null ? "Cipő szerkesztése" : "Új cipő hozzáadása"}</h3>

                        <form id="addForm" onSubmit={handleSubmit} className="form form--modal">
                            {/* Márka */}
                            <div className="field">
                                <label htmlFor="brand" className="field-label">Márka</label>
                                <div className="field-control">
                                    <select
                                        id="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                        className="control control--select"
                                    >
                                        <option value="">Válassz…</option>
                                        {Object.keys(subBrandOptions).map((b) => (
                                            <option key={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Almárka */}
                            <div className="field">
                                <label htmlFor="subBrand" className="field-label">Almárka</label>
                                <div className="field-control">
                                    <select
                                        id="subBrand"
                                        value={formData.subBrand}
                                        onChange={handleChange}
                                        required
                                        className="control control--select"
                                    >
                                        <option value="">Válassz…</option>
                                        {currentSubBrands.map((sb) => (
                                            <option key={sb}>{sb}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Méret */}
                            <div className="field">
                                <label htmlFor="size" className="field-label">Méret</label>
                                <div className="field-control">
                                    <select
                                        id="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        required
                                        className="control control--select"
                                    >
                                        <option value="">Válassz…</option>
                                        {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Szín */}
                            <div className="field">
                                <label htmlFor="color" className="field-label">Szín</label>
                                <div className="field-control">
                                    <select
                                        id="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        required
                                        className="control control--select"
                                    >
                                        <option value="">Válassz…</option>
                                        {["Fekete", "Fehér", "Piros", "Kék", "Szürke"].map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Ár */}
                            <div className="field">
                                <label htmlFor="price" className="field-label">Ár</label>
                                <div className="field-control">
                                    <input
                                        id="price"
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="control"
                                        placeholder="0"
                                    />
                                    <span className="unit">Ft</span>
                                </div>
                            </div>

                            {/* Mentés */}
                            <button type="submit" className="form-submit">Mentés</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
