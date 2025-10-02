import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import noteRoutes from './routes/notes';
import goalRoutes from './routes/goals';
import financeRoutes from './routes/finance';
import articleRoutes from './routes/articles';
import feedRoutes from './routes/feed';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Слишком много запросов с этого IP, попробуйте позже.',
});
app.use(limiter);

// CORS
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081', 
  'http://localhost:8082',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter((origin): origin is string => typeof origin === 'string');

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`📊 Проверка здоровья: http://localhost:${port}/health`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${port} уже используется`);
    console.log('💡 Попробуйте:');
    console.log('   1. Закрыть другие приложения, использующие этот порт');
    console.log('   2. Изменить PORT в .env файле');
    console.log(`   3. Завершить процесс: taskkill /PID [PID] /F`);
    process.exit(1);
  } else {
    console.error('❌ Ошибка запуска сервера:', err);
    process.exit(1);
  }
});