import { userStore } from "@/model/UserStore";

export function GET(request: Request) {
  const users = userStore.getAll();

  return new Response(JSON.stringify({ data: { users } }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  });
}
