"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

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

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roadRes, usersRes] = await Promise.all([
          fetch("https://project3-2025a-breno-pedro.onrender.com/roadmaps"),
          fetch("https://project3-2025a-breno-pedro.onrender.com/usuarios"),
        ]);

        if (!roadRes.ok) throw new Error("Falha ao carregar roadmaps");
        if (!usersRes.ok) throw new Error("Falha ao carregar usuários");

        const roads: Roadmap[] = await roadRes.json();
        const users: Array<{ _id: string; nome: string }> = await usersRes.json();

        const map: Record<string, string> = {};
        users.forEach((u) => {
          map[u._id] = u.nome;
        });

        setUsersMap(map);
        setRoadmaps(roads);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Carregando roadmaps...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  // Filtra roadmaps pelo título
  const filtered = roadmaps.filter((rm) =>
    rm.titulo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="space-y-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roadmaps Criados</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Filtrar por título"
            value={filter}
            onChange={(e) => setFilter(e.currentTarget.value)}
            className="w-80"
          />
          <Link href="/roadmaps/mine">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Ver meus Roadmaps
            </Button>
          </Link>
          <Link href="/roadmaps/create">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <CirclePlus className="mr-2" /> Criar novo RoadMap
            </Button>
          </Link>
        </div>
      </div>

      {filtered.map((rm) => (
        <Card
          key={rm._id}
          className="mx-auto p-6 max-w-[1000px] overflow-y-auto overflow-x-hidden"
        >
          <CardHeader className="px-0">
            <CardTitle className="text-2xl break-words break-all">
              {rm.titulo}
            </CardTitle>
            <CardDescription className="text-base break-words break-all">
              {rm.descricao}
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">
              Criado por: {usersMap[rm.autor] || rm.autor}
            </p>
          </CardHeader>

          <div className="mt-8 relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-700 rounded-full" />
            <div className="space-y-16">
              {rm.passos.map((passo, index) => (
                <div key={passo._id} className="relative">
                  <div className="absolute left-6 top-6 w-10 h-1 bg-blue-200 dark:bg-blue-700" />
                  <div className="flex items-start ml-16">
                    <div className="p-4 rounded-lg border border-blue-100 bg-white dark:bg-zinc-700 w-full">
                      <h3 className="font-semibold text-lg break-words break-all">
                        {passo.titulo}
                      </h3>
                      <p className="text-gray-600 dark:text-zinc-200 mt-1 break-words break-all">
                        {passo.descricao}
                      </p>
                      <div className="absolute right-1 top-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
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
    </main>
  );
}