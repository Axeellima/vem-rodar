import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import './src/models/index';
import http from 'http';
import router from './src/routes/index';
import { handleWebSocketConnection } from './websocket';

const app = express();
const serverHttp = http.createServer(app);
expressWs(app, serverHttp);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

// Use o express-ws para configurar a rota WebSocket

export { app, serverHttp };
