import { userStore } from "@/model/UserStore";

export function GET(request: Request) {
  const users = userStore.getAll();

  return new Response(JSON.stringify({ data: { users } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}