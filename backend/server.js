import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Node.js backend is running' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
