"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Sessão não encontrada");

        const session = await res.json();

        if (session?.user) {
          const resSync = await fetch("/api/usuarios/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: session.user.name,
              login: session.user.email,
            }),
          });

          if (!resSync.ok) throw new Error("Erro ao sincronizar usuário");

          const backendUser = await resSync.json();

          sessionStorage.setItem("user", JSON.stringify(backendUser));

          router.push("/roadmaps");
        } else {
          throw new Error("Usuário não autenticado");
        }
      } catch (err) {
        console.error("Erro na callback do Google:", err);
        router.push("/login"); 
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? <p>Carregando...</p> : <p>Redirecionando...</p>}
    </div>
  );
}
