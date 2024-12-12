import express from "express";
import bodyParser from "body-parser";
import recommendationsRouter from "./routes/recommendations";
import usersRouter from "./routes/users";


const app = express();

app.use(bodyParser.json());

app.use('/recommendations', recommendationsRouter);
app.use('/users', usersRouter);


export default app;


