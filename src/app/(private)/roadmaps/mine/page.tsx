"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftCircle, CirclePlus, Edit2, Trash2 } from "lucide-react";

interface Passo {
  _id: string;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

interface Roadmap {
  _id: string;
  titulo: string;
  descricao: string;
  autor: string;
  createdAt: string;
  updatedAt: string;
  passos: Passo[];
}

export default function MyRoadmapsPage() {
  const [mine, setMine] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      setError("Você não está logado");
      setLoading(false);
      return;
    }
    const user = JSON.parse(stored);
    const userId = user._id as string;

    fetch("https://project3-2025a-breno-pedro.onrender.com/roadmaps")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar roadmaps");
        return res.json() as Promise<Roadmap[]>;
      })
      .then((all) => {
        setMine(all.filter((rm) => rm.autor === userId));
      })
      .catch((err: any) => setError(err.message || "Erro desconhecido"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://project3-2025a-breno-pedro.onrender.com/roadmaps/${id}`, {
        method: "DELETE",
      });
      setMine((prev) => prev.filter((rm) => rm._id !== id));
    } catch (err) {
      console.error("Erro ao excluir roadmap:", err);
    } finally {
      setShowConfirmId(null);
    }
  };

  if (loading)
    return <p className="p-6 text-center">Carregando seus roadmaps...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <main className="space-y-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Roadmaps</h1>
        <div className="flex items-center space-x-4">
          <Link href="/roadmaps">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <ArrowLeftCircle />
              Voltar para todos os Roadmaps
            </Button>
          </Link>
          <Link href="/roadmaps/create">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <CirclePlus className="mr-2" /> Criar novo Roadmap
            </Button>
          </Link>
        </div>
      </div>

      {mine.length === 0 && (
        <p className="text-center text-muted-foreground">
          Você ainda não criou nenhum roadmap.
        </p>
      )}

      {mine.map((rm) => (
        <Card key={rm._id} className="mx-auto p-6 max-w-[1000px] overflow-y-auto overflow-x-hidden">
          <CardHeader className="px-0 relative">
            <CardTitle className="text-2xl break-words break-all">{rm.titulo}</CardTitle>
            <CardDescription className="text-base break-words break-all">
              {rm.descricao}
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">
              Criado por: Eu mesmo
            </p>

            <div className="flex items-center justify-between">
              <Link
                href={`/roadmaps/${rm._id}/edit`}
                className="absolute top-0 right-2"
              >
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4 text-blue-500" />
                  <span className="sr-only">Editar roadmap</span>
                </Button>
              </Link>

              <Button
                className="absolute top-0 right-12 text-blue-500"
                variant="outline"
                size="icon"
                onClick={() => setShowConfirmId(rm._id)}
              >
                <Trash2 />
              </Button>
            </div>
          </CardHeader>

          <div className="mt-8 relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-700 rounded-full" />

            <div className="space-y-16">
              {rm.passos.map((passo, index) => (
                <div key={passo._id} className="relative">
                  <div className="absolute left-6 top-6 w-10 h-1 bg-blue-200 dark:bg-blue-700" />

                  <div className="flex items-start ml-16">
                    <div className="p-4 rounded-lg border border-blue-100 bg-white dark:bg-zinc-700 w-full">
                      <h3 className="font-semibold text-lg break-words break-all">{passo.titulo}</h3>
                      <p className="text-gray-600 dark:text-zinc-200 mt-1 break-words break-all">
                        {passo.descricao}
                      </p>

                      <div className="absolute right-4 top-4 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
      {showConfirmId && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 w-[90%] max-w-md text-center pointer-events-auto">
            <h2 className="text-lg font-semibold mb-4">
              Tem certeza que deseja excluir este roadmap?
            </h2>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowConfirmId(null)}>
                Voltar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(showConfirmId)}
              >
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
