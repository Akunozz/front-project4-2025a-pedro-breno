import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(
      "https://project4-2025a-pedro-breno.onrender.com/api/usuarios/sync",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /api/usuarios/sync:", error);
    return NextResponse.json(
      { error: "Erro interno na API." },
      { status: 500 }
    );
  }
}
