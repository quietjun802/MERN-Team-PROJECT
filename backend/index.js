const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 기본 미들웨어
app.use(express.json());
app.use(cors({ origin: process.env.FRONT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

// 요청 로깅(디버그용)
app.use((req,res,next)=>{ console.log('[REQ]', req.method, req.url); next(); });

// 라우트 장착
const bucketRoutes = require('./routes/bucketRoutes');
app.use('/api/buckets', bucketRoutes);

// 헬스체크
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err.message));

// 루트
app.get('/', (_req, res) => res.send('Hello Express'));

app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));
