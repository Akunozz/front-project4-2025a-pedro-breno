"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

interface PassoInput {
  _id?: string;
  titulo: string;
  descricao: string;
  concluido?: boolean;
}

export default function EditRoadmapPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { id } = params;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [passos, setPassos] = useState<PassoInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await fetch(
          `https://project3-2025a-breno-pedro.onrender.com/roadmaps/${id}`
        );
        if (!res.ok) throw new Error("Não foi possível carregar o roadmap");
        const data = await res.json();
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setPassos(
          data.passos.map((p: any) => ({
            _id: p._id,
            titulo: p.titulo,
            descricao: p.descricao,
            concluido: p.concluido,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [id]);

  function addPasso() {
    setPassos((prev) => [
      ...prev,
      { titulo: "", descricao: "", concluido: false },
    ]);
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
      const body = { titulo, descricao, passos };
      const res = await fetch(
        `https://project3-2025a-breno-pedro.onrender.com/roadmaps/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Falha ao atualizar roadmap");
      }
      router.push("/roadmaps/mine");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="p-6 text-center">Carregando dados...</p>;
  }
  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <main className="p-6 w-full mx-auto space-y-6">
        <div className="flex items-center justify-between space-x-6">
          <h1 className="text-2xl font-bold">Editar Roadmap</h1>
          <Link href="/roadmaps/mine">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <ArrowLeftCircle />
              Voltar para meus Roadmaps
            </Button>
          </Link>
        </div>
      <form onSubmit={handleSubmit} className="mx-auto space-y-4 max-w-[1000px]">
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
          {loading ? "Salvando..." : "Atualizar Roadmap"}
        </Button>
      </form>
    </main>
  );
}
