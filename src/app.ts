import { connectDB } from './utils/database';
import app from "./server";

const PORT = 8000;


connectDB().then(() => {
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on port 8080');
});

