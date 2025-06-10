"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftCircle } from "lucide-react";

interface PassoInput {
  titulo: string;
  descricao: string;
}

export default function NewRoadmapPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [passos, setPassos] = useState<PassoInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addPasso() {
    setPassos((prev) => [...prev, { titulo: "", descricao: "" }]);
  }

  function removePasso(index: number) {
    setPassos((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePasso(index: number, field: keyof PassoInput, value: string) {
    setPassos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const stored = sessionStorage.getItem("user");
      const usuario = stored ? JSON.parse(stored) : null;
      const autor = usuario?._id;
      if (!autor) throw new Error("Usuário não autenticado");

      const body = {
        titulo,
        descricao,
        passos: passos.map((p) => ({ ...p, concluido: false })),
        autor,
      };
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Falha ao criar roadmap");
      router.push("/roadmaps");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 w-full space-y-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Criar Novo Roadmap</h1>
        <div>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
            variant="outline"
            onClick={() => router.push("/roadmaps/mine")}
          >
            <ArrowLeftCircle className="mr-2" />
            Voltar para Meus Roadmaps
          </Button>
        </div>
      </header>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div className="space-y-1">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.currentTarget.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Passos</h2>
            <Button type="button" onClick={addPasso} variant="outline">
              Adicionar Passo
            </Button>
          </div>

          {passos.map((passo, idx) => (
            <div key={idx} className="border p-4 rounded space-y-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removePasso(idx)}
              >
                &times;
              </Button>
              <div className="space-y-1">
                <Label htmlFor={`passo-titulo-${idx}`}>Título do Passo</Label>
                <Input
                  id={`passo-titulo-${idx}`}
                  value={passo.titulo}
                  onChange={(e) =>
                    updatePasso(idx, "titulo", e.currentTarget.value)
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`passo-desc-${idx}`}>Descrição do Passo</Label>
                <Textarea
                  id={`passo-desc-${idx}`}
                  value={passo.descricao}
                  onChange={(e) =>
                    updatePasso(idx, "descricao", e.currentTarget.value)
                  }
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Criar Roadmap"}
        </Button>
      </form>
    </main>
  );
}
