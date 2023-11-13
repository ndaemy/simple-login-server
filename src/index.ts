import { sql } from "@vercel/postgres";
import cors from "cors";
import "dotenv/config";
import express, { Request } from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  next();
});

const authRouter = express.Router();
const usersRouter = express.Router();

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody extends LoginBody {
  username: string;
}

authRouter.post("/login", async (req: Request<{}, {}, LoginBody>, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "빠진 필드가 있습니다." });
  }

  const { rows } = await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;

  if (rows.length === 0) {
    return res.status(400).json({ error: "이메일 혹은 비밀번호가 틀렸습니다." });
  }

  res.json({
    data: "로그인에 성공하였습니다.",
  });
});

authRouter.post("/register", async (req: Request<{}, {}, RegisterBody>, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "빠진 필드가 있습니다." });
  }

  const { rowCount } =
    await sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
  if (rowCount > 0) {
    return res.status(400).json({ error: "이미 존재하는 유저입니다." });
  }

  const { rows } =
    await sql`INSERT INTO users (email, username, password) VALUES (${email}, ${username}, ${password})`;

  console.log(rows);

  res.json({
    data: "유저가 성공적으로 생성되었습니다.",
  });
});

usersRouter.get("/", async (req, res) => {
  const { rows } = await sql`SELECT * FROM users`;
  res.json({ data: { users: rows } });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

export default app;
