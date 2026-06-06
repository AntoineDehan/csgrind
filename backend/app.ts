import express from "express";
import type { NextFunction, Request, Response } from "express";
import userRouter from "./src/routes/user";
import authRouter from "./src/routes/auth";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);

app.use("/auth", authRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
