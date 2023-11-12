import { userStore } from "@/model/UserStore";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, username } = body;

  if (!email || !password || !username) {
    return new Response(JSON.stringify({ error: "Missing email or password or username" }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  }

  const emailExist = userStore.findUnique(email);
  const usernameExist = userStore.findUnique(username);
  if (emailExist || usernameExist) {
    return new Response(JSON.stringify({ error: "Email already exists" }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  }

  const user = userStore.create({
    email,
    password,
    username,
  });

  return new Response(JSON.stringify({ data: { user } }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  });
}
