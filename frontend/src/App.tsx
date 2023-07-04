import React from 'react';
import { io } from "socket.io-client";

import LoginForm from './components/LoginForm';


function App() {
  function connect() {

    const socket = io("ws://localhost:5000");
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

  }


  return (
    <div className="App">
        <button className='socketButton' onClick={connect}> CONNECT SOCKET IO</button>
        <LoginForm />
    </div>
  );
}

export default App;
