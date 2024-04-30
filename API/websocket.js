import { getWss } from 'express-ws';
const channels = {};

export const handleWebSocketConnection = (ws, req) => {
   ws.on('message', (message) => {
      const { event, data } = JSON.parse(message);
      if (event === 'joinRace') {
         const raceId = data.raceId;
         if (!channels[raceId]) {
            channels[raceId] = [];
         }
         channels[raceId].push(ws);
         console.log(`Cliente ${ws.id} se conectou à corrida ${raceId}`);
      }
   });

   // Lógica para lidar com mensagens recebidas do cliente
   ws.on('message', (message) => {
      const { event, data } = JSON.parse(message);
      if (event === 'message') {
         const { raceId, message: messageData } = data;
         // Envie a mensagem apenas para os sockets no canal correspondente à corrida
         if (channels[raceId]) {
            channels[raceId].forEach((client) => {
               if (client !== ws) {
                  // Evite enviar a mensagem de volta para o mesmo cliente
                  client.send(
                     JSON.stringify({ event: 'message', data: messageData }),
                  );
               }
            });
         }
      }
   });
   ws.on('close', () => {
      // Remova o cliente do canal ao se desconectar
      Object.keys(channels).forEach((raceId) => {
         channels[raceId] = channels[raceId].filter((client) => client !== ws);
      });
      console.log('Um cliente se desconectou do servidor de websockets');
   });
   // Lógica para lidar com desconexões de clientes
};
