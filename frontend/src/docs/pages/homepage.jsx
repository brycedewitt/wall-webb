import React, { useEffect, useRef, useState } from 'react';
import { useWebsocket } from "../../hooks/index";

const WEBSOCKET_URL = 'ws://localhost:3001'

const Homepage = () => {
  const [messagesList, setMessagesList] = useState([]);
  const [outgoingMessage, setOutgoingMessage] = useState('');
  const sock = useWebsocket({ socketUrl: WEBSOCKET_URL });

  useEffect(() => {
    if (sock.data) {
      setMessagesList(messagesList => [...messagesList, sock.data]);
    }
  }, [sock.data]);

  const sendData = () => {
    if (outgoingMessage) {
      sock.send(outgoingMessage);
    }
  };

  return (
    <>
      <h2>Websocket Demo</h2>
      <hr />
      <h4>{`Connection Status: ${sock.socketState}`}</h4>
      <br />
      <input
        type={"text"}
        value={outgoingMessage}
        onChange={e => setOutgoingMessage(e.target.value)}
        placeholder={"Send a message..."} />
      <button onClick={sendData}>Send Message</button>
      <hr />
      <h4>Messages from server:</h4>
      {messagesList.map(ele => (
        <div key={ele.timestamp}>
          {ele.message}
        </div>
      ))}
    </>
  );
};

export default Homepage;