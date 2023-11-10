import { userStore } from "@/model/UserStore";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = userStore.findUnique(email);
  if (!user) {
    return new Response(JSON.stringify({ error: "Email not exists" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (user.password !== password) {
    return new Response(JSON.stringify({ error: "Password not match" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data: { message: `Hello ${user.username}` } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}