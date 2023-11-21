import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
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
    return res
      .status(400)
      .json({ error: { code: "required_fields", message: "빠진 필드가 있습니다" } });
  }

  const { rows, rowCount } = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (!rowCount) {
    return res
      .status(400)
      .json({ error: { code: "not_registered_email", message: "가입되지 않은 이메일입니다" } });
  }

  const isPasswordCorrect = await bcrypt.compare(password, rows[0].password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ error: { code: "wrong_password", message: "비밀번호를 잘못 입력했습니다" } });
  }

  res.json({
    data: {
      message: `안녕하세요 ${rows[0].username}님!`,
    },
  });
});

authRouter.post("/register", async (req: Request<{}, {}, RegisterBody>, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: { code: "required_fields", message: "빠진 필드가 있습니다" } });
  }

  const { rowCount } = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (rowCount > 0) {
    return res
      .status(400)
      .json({ error: { code: "conflict_email", message: "이미 존재하는 이메일입니다" } });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } =
    await sql`INSERT INTO users (email, username, password) VALUES (${email}, ${username}, ${hashedPassword})`;

  res.json({
    data: {
      code: "succeed",
      message: "유저가 성공적으로 생성되었습니다",
    },
  });
});

usersRouter.get("/", async (req, res) => {
  const { rows } = await sql`SELECT * FROM users`;
  res.json({
    data: {
      users: rows.map(({ email, username }) => ({ email, username })),
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

export default app;
