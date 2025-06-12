import { DATABASE_URL } from "#constants/env.js";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import transactionRouter from "./transaction.js";
import userRouter from "./user.js";

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/transaction", transactionRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`, DATABASE_URL);
});
