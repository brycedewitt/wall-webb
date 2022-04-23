import { useState, useEffect } from "react";

export const SOCKET_STATES = Object.freeze({
  PENDING: 'pending',
  CONNECTED: 'connected',
  FAILED: 'failed',
  READY: 'ready'
})

const useWebsocket = ({ socketUrl, defaultRetry = 3, retryInterval = 3000 }) => {
  const [data, setData] = useState();
  const [send, setSend] = useState(() => () => undefined);
  const [retry, setRetry] = useState(defaultRetry);
  const [socketState, setSocketState] = useState(SOCKET_STATES.READY);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);

    ws.onopen = event => {
      console.log('Connected to socket', event);
      setSocketState(SOCKET_STATES.CONNECTED);

      setSend(() => {
        return (data) => {
          try {
            const d = JSON.stringify(data);
            ws.send(d);
            return true;
          } catch (err) {
            console.log('Error sending to socket', err)
            return false;
          }
        };
      });

      ws.onmessage = event => {
        const parseMessage = data => {
          try {
            return JSON.parse(data);
          } catch (err) {
            return data;
          }
        };

        setData({ message: parseMessage(event.data), timestamp: Date.now() });
      };
    };

    ws.onclose = event => {
      // leave if there's a pending connection
      if (socketState === SOCKET_STATES.READY) return;

      setSocketState(SOCKET_STATES.FAILED);
      console.log('Socket Closed', event)
      if (retry > 0) {
        setTimeout(() => {
          setRetry(retry => retry - 1);
        }, retryInterval);
      }
    };

    return () => {
      ws.close();
    };

  }, [retry]);

  return { send, data, socketState };
};

export default useWebsocket;