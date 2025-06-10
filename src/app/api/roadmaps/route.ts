// app/api/roadmaps/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL = "https://project3-2025a-breno-pedro.onrender.com/roadmaps";

export async function GET() {
  const res = await fetch(BACKEND_URL);
  if (!res.ok) return NextResponse.error();
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // propaga status do backend
      const text = await res.text();
      return new NextResponse(text, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/roadmaps error:", err);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
