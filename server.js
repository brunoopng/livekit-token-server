import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';

const app = express();

/* ===== middlewares ===== */
app.use(cors());
app.use(express.json());

/* ===== health check ===== */
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'livekit-token-server' });
});

/* ===== token (POST) ===== */
app.post('/token', (req, res) => {
  try {
    const { room, identity } = req.body || {};

    if (!room || !identity) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios: room, identity'
      });
    }

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true
    });

    res.json({ token: token.toJwt() });
  } catch (err) {
    console.error('[TOKEN ERROR]', err);
    res.status(500).json({ error: 'Erro ao gerar token' });
  }
});

/* ===== token (GET - debug) ===== */
app.get('/token', (req, res) => {
  const { room, identity } = req.query || {};

  if (!room || !identity) {
    return res.status(400).json({
      error: 'Use ?room=xxx&identity=yyy'
    });
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );

  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true
  });

  res.json({ token: token.toJwt() });
});

/* ===== start ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('LiveKit token server running on port', PORT);
});
