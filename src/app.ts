import express from 'express';
import bodyParser from 'body-parser';
import recommendationsRouter from './routes/recommendations';
import usersRouter from './routes/users';
import { connectDB } from './utils/database';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use('/recommendations', recommendationsRouter);
app.use('/users', usersRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on port 8080');
});

export default app;
