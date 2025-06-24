"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import logo from "@/assets/roadmap.png";
import { toast } from "sonner";
import { createAuthClient } from "better-auth/client";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authClient = createAuthClient({
    basePath: "/api/auth",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/usuarios");

      if (!res.ok) throw new Error("Falha ao buscar usuários");

      const users: Array<{ login: string; senha: string; [key: string]: any }> =
        await res.json();

      const user = users.find(
        (u) => u.login === login.trim() && u.senha === senha.trim() && u.senha !== ""
      );

      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        router.push("/roadmaps");
      } else {
        setError("Login ou senha inválidos");
        toast.error("Usuário ou senha inválidos");
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log("Iniciando login com Google...");

      const session = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/roadmaps/callback",
      });

      console.log("Session recebida:", session);

      if (session && "user" in session) {
        const user = (session as any).user;
        console.log("Dados do usuário:", user);

        const res = await fetch("/api/usuarios/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: user.name,
            login: user.email,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Erro ao sincronizar usuário:", error);
          throw new Error(error.error || "Erro ao criar usuário");
        }

        const backendUser = await res.json();
        console.log("Usuário salvo no backend:", backendUser);

        sessionStorage.setItem("user", JSON.stringify(backendUser));

        router.push("/roadmaps");
      } else {
        console.error("Sessão inválida. Login Google falhou.");
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro no login com Google. Veja o console.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem vindo!</h1>
                <p className="text-muted-foreground text-balance">
                  Entre na sua conta para continuar
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="login">Usuário</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="user"
                  value={login}
                  onChange={(e) => setLogin(e.currentTarget.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="******"
                  value={senha}
                  onChange={(e) => setSenha(e.currentTarget.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Login"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Ou continue com
                </span>
              </div>
              <div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    console.log("Botão clicado!");
                    handleGoogleLogin();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                  Entrar com Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Não tem conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Cadastre-se
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={logo}
              alt="Logo"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
