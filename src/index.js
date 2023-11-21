"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("@vercel/postgres");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    next();
});
const authRouter = express_1.default.Router();
const usersRouter = express_1.default.Router();
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: { code: "required_fields", message: "빠진 필드가 있습니다" } });
    }
    const { rows, rowCount } = yield (0, postgres_1.sql) `SELECT * FROM users WHERE email = ${email}`;
    if (!rowCount) {
        return res
            .status(400)
            .json({ error: { code: "not_registered_email", message: "가입되지 않은 이메일입니다" } });
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, rows[0].password);
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
}));
authRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res
            .status(400)
            .json({ error: { code: "required_fields", message: "빠진 필드가 있습니다" } });
    }
    const { rowCount } = yield (0, postgres_1.sql) `SELECT * FROM users WHERE email = ${email}`;
    if (rowCount > 0) {
        return res
            .status(400)
            .json({ error: { code: "conflict_email", message: "이미 존재하는 이메일입니다" } });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const { rows } = yield (0, postgres_1.sql) `INSERT INTO users (email, username, password) VALUES (${email}, ${username}, ${hashedPassword})`;
    res.json({
        data: {
            code: "succeed",
            message: "유저가 성공적으로 생성되었습니다",
        },
    });
}));
usersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield (0, postgres_1.sql) `SELECT * FROM users ORDER BY created_at DESC`;
    res.json({
        data: {
            users: rows.map(({ email, username }) => ({ email, username })),
        },
    });
}));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
exports.default = app;
//# sourceMappingURL=index.js.map