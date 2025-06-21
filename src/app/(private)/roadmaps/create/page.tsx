"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftCircle, CirclePlus, Trash2, Map, Eraser, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [iaAberto, setIaAberto] = useState(false);
  const [temaIA, setTemaIA] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);

  const isBusy = loading || loadingIA;

  function addPasso() {
    setPassos((prev) => [...prev, { titulo: "", descricao: "" }]);
    setTimeout(() => {
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
      toast.success("Roadmap criado com sucesso!");
      router.push("/roadmaps/mine");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function gerarRoadmapIA() {
    if (!temaIA.trim()) {
      toast.error("Por favor, digite um tema para gerar o roadmap");
      return;
    }

    try {
      setLoadingIA(true);
      const res = await fetch(
        "https://project4-2025a-pedro-breno.onrender.com/api/generate-roadmap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: temaIA }),
        }
      );

      if (!res.ok) throw new Error("Falha ao gerar roadmap");

      const data = await res.json();
      const roadmap = data.roadmap;

      setTitulo(roadmap.titulo || "");
      setDescricao(roadmap.descricao || "");
      if (Array.isArray(roadmap.passos)) {
        setPassos(
          roadmap.passos.map((p: any) => ({
            titulo: p.titulo || "",
            descricao: p.descricao || "",
          }))
        );
      }
      toast.success("Roadmap gerado com sucesso!");
      setIaAberto(false);
      setTemaIA("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar roadmap com IA.");
    } finally {
      setLoadingIA(false);
    }
  }

  function limparCampos() {
    setTitulo("");
    setDescricao("");
    setPassos([]);
    setError(null);
    setTemaIA("");
    toast("Campos limpos com sucesso.");
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
            Voltar para meus Roadmaps
          </Button>
        </div>
      </header>

      <div className="mb-6 p-4 border rounded max-w-[1000px] mx-auto">
        <Button
          variant="outline"
          onClick={() => setIaAberto((a) => !a)}
          className="mb-4"
        >
          <Sparkles className="mr-2" />
          {iaAberto ? "Fechar Assistente IA" : "Abrir Assistente IA"}
        </Button>

        {iaAberto && (
          <div className="space-y-2">
            <Label htmlFor="tema-ia">Tema para geração do roadmap</Label>
            <Input
              id="tema-ia"
              value={temaIA}
              onChange={(e) => setTemaIA(e.currentTarget.value)}
              placeholder="Digite um tema, ex: Aprender JavaScript"
            />
            <Button
              onClick={gerarRoadmapIA}
              disabled={loadingIA}
              className="mt-2"
            >
              {loadingIA ? "Gerando..." : "Gerar Roadmap com IA"}
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 max-w-[1000px] mx-auto"
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
              <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold shadow">
                {idx + 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-5 text-blue-500 hover:text-blue-600"
                onClick={() => removePasso(idx)}
              >
                <Trash2 />
              </Button>
              <div className="space-y-1 mt-8">
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
          <CirclePlus className="mr-2" />
          Adicionar passo
        </Button>

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={limparCampos}
            className="w-1/2 text-red-500 hover:text-red-600"
          >
            <Eraser className="mr-2 text-red-500 hover:text-red-600" />
            Limpar campos
          </Button>

          <Button
            type="submit"
            disabled={loading || passos.length === 0}
            className="w-1/2"
          >
            <Map className="mr-2" />
            {loading ? "Salvando..." : "Criar Roadmap"}
          </Button>
        </div>
      </form>
      {isBusy && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
            <p className="text-white">
              {loadingIA ? "Gerando roadmap com IA..." : "Salvando roadmap..."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
