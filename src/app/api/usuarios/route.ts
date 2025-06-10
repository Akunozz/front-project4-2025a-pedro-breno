// app/api/usuarios/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://project3-2025a-breno-pedro.onrender.com/usuarios"
  );
  if (!res.ok) return NextResponse.error();
  const data = await res.json();
  return NextResponse.json(data);
}
