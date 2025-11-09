import React, { useMemo } from "react";

export default function Stats() {
    // LocalStorage-ból beolvasás
    const shoes = useMemo(() => JSON.parse(localStorage.getItem("shoes") || "[]"), []);

    // Összesítés
    const totalCount = shoes.length;
    const totalValue = shoes.reduce((sum, s) => sum + (parseInt(s.price, 10) || 0), 0);

    // Márkánkénti csoportosítás
    const byBrand = shoes.reduce((acc, s) => {
        const key = s.brand || "Ismeretlen";
        acc[key] = acc[key] || { count: 0, value: 0 };
        acc[key].count += 1;
        acc[key].value += (parseInt(s.price, 10) || 0);
        return acc;
    }, {});

    return (
        <div className="main-content">
            <h2>Kimutatások</h2>

            <div >
                <div className="shoe-card">
                    <h3>Összes termék</h3>
                    <p >{totalCount} db</p>
                </div>
                <div className="shoe-card">
                    <h3>Összérték</h3>
                    <p >{totalValue.toLocaleString("hu-HU")} Ft</p>
                </div>
            </div>

            <h3 >Márkák</h3>
            <div >
                {Object.entries(byBrand).map(([brand, data]) => (
                    <div key={brand} className="shoe-card">
                        <h4 >{brand}</h4>
                        <p><strong>Darab:</strong> {data.count} db</p>
                        <p><strong>Érték:</strong> {data.value.toLocaleString("hu-HU")} Ft</p>
                    </div>
                ))}
                {Object.keys(byBrand).length === 0 && <p>Nincs megjeleníthető adat.</p>}
            </div>
        </div>
    );
}
