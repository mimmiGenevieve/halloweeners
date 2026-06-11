import { sql } from "@/lib/neon";

export async function GET() {
  try {
    const [row] = await sql<
      { now: string; database_name: string; role_name: string }[]
    >`SELECT NOW()::text AS now, current_database() AS database_name, current_user AS role_name`;

    return Response.json({ ok: true, connection: row });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}