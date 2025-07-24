"use client";
import { useState } from "react";

export default function TestFormPage() {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Test Saisie React Pure</h2>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Tapez ici..."
        style={{ width: "100%", padding: 8, fontSize: 18, marginTop: 16 }}
      />
      <div style={{ marginTop: 16 }}>
        <b>Valeur :</b> {value}
      </div>
    </div>
  );
} 