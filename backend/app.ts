import { env } from "./src/config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import { runReportScheduler } from "./src/jobs/reportScheduler";
import { runLeetifyAccountCheck } from "./src/jobs/leetifyAccountCheck";
import { errorHandler } from "./src/middlewares/error.middleware";
import userRouter from "./src/routes/user";
import authRouter from "./src/routes/auth";
import tipRouter from "./src/routes/tip";
import taskRouter from "./src/routes/task";
import badgeRouter from "./src/routes/badge";
import goalRouter from "./src/routes/goal";
import reportRouter from "./src/routes/report";

const app = express();
const port = env.PORT;

app.use(helmet());
app.use(cors({ origin: env.SITE_URL }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);

app.use("/auth", authRouter);

app.use("/tips", tipRouter);

app.use("/tasks", taskRouter);

app.use("/badges", badgeRouter);

app.use("/goals", goalRouter);

app.use("/reports", reportRouter);

app.use(errorHandler);

cron.schedule(
  "0 07 * * *",
  () => {
    runLeetifyAccountCheck().catch((err) => {
      console.error("Leetify account check crashed:", err);
    });
  },
  { timezone: "Europe/Paris" },
);

cron.schedule(
  "0 13 * * *",
  () => {
    runReportScheduler().catch((err) => {
      console.error("Report scheduler crashed:", err);
    });
  },
  { timezone: "Europe/Paris" },
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
