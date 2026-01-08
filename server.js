import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';

const app = express();
app.use(cors());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

app.get('/token', (req, res) => {
  const room = req.query.room || 'global';
  const identity = req.query.id || 'user_' + Math.random().toString(36).slice(2);

  const token = new AccessToken(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    { identity }
  );

  token.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true
  });

  res.send(token.toJwt());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Token server running on port', port);
});
