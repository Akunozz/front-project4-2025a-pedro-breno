"use client";

import React, { useState } from "react";

export default function GenerateAI() {
  const [assunto, setAssunto] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");

  async function handleGerarRoadmap() {
    setLoading(true);
    setResultado("");
    try {
      // Chamar api aquii
      await new Promise((r) => setTimeout(r, 1500)); 
      
      setResultado(`Roadmap gerado para o assunto: "${assunto}"`);
    } catch (err) {
      setResultado("Erro ao gerar roadmap.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Gerar Roadmap com IA</h1>
      <label htmlFor="assunto" className="block mb-2 font-semibold">
        Assunto:
      </label>
      <input
        type="text"
        id="assunto"
        value={assunto}
        onChange={(e) => setAssunto(e.target.value)}
        placeholder="Digite o assunto do roadmap"
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />
      <button
        onClick={handleGerarRoadmap}
        disabled={!assunto || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Gerando..." : "Gerar Roadmap"}
      </button>
      {resultado && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">{resultado}</div>
      )}
    </div>
  );
}
