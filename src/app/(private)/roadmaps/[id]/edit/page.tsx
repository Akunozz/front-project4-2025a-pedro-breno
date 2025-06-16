"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeftCircle, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [passos, setPassos] = useState<PassoInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await fetch(
          `https://project4-2025a-pedro-breno.onrender.com/roadmaps/${id}`
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
    setTimeout(() =>{
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
        `https://project4-2025a-pedro-breno.onrender.com/roadmaps/${id}`,
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
      toast.success("Roadmap atualizado com sucesso!");
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
      <form
        onSubmit={handleSubmit}
        className="mx-auto space-y-4 max-w-[1000px]"
      >
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
          </div>
          {passos.map((passo, idx) => (
            <div key={idx} className="border p-4 rounded space-y-2 relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1 right-5 text-blue-500 hover:text-blue-600"
                onClick={() => removePasso(idx)}
              >
                <Trash2 />
              </Button>
              <div className="space-y-4">
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
              <div className="space-y-4">
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

        {passos.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Nenhum passo adicionado. Clique em "Adicionar Passo" para começar.
          </p>
        )}

        <div ref={bottomRef} />

        <Button
          type="button"
          className="flex justify-center w-full mx-auto"
          onClick={addPasso}
          variant="outline"
        >
          <CirclePlus />
          Adicionar Passo
        </Button>

        <div className="flex justify-center w-full mx-auto">
          <Button type="submit" disabled={loading} className="w-full">
            <Pencil />
            {loading ? "Salvando..." : "Atualizar Roadmap"}
          </Button>
        </div>
      </form>
    </main>
  );
}
