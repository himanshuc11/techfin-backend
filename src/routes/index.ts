import { DATABASE_URL } from "#constants/env.js";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import transactionRouter from "./transaction.js";
import userRouter from "./user.js";
import { insertDummyTransactions } from "#faker/index.js";

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/transaction", transactionRouter);
app.use("/user", userRouter);

app.get("/faker", async (_, res) => {
  try {
    await insertDummyTransactions(10000);
    res.send("Success");
  } catch (err) {
    console.error(err);
    res.send("Failure");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`, DATABASE_URL);
});
