import React, { useState, useEffect } from 'react';
import './App.css';

const request = require('request');


function App() {

  const [servers, setServers] = useState([
    {
      url: "https://www.stackworx.io",
      is_up: false,
      last_update: "unknown",
    },{
      url: "https://status.gitlab.com/",
      is_up: false,
      last_update: "unknown",
    },{
      url: "https://dev.vantage.run/health",
      is_up: false,
      last_update: "unknown",
    }
  ] as any);
  const [theme, setTheme] = useState("light" as String);

  useEffect(() => {
    let update_frequency_minutes = 1;
    let update_frequency_seconds = update_frequency_minutes * 60;
    let update_frequency_milliseconds = update_frequency_seconds * 1000;
    console.log(update_frequency_milliseconds);
    setInterval(() => {
      checkServers();
    }, update_frequency_milliseconds);
  }, []);


  const checkServers = () => {
    console.log("Running checkServers");
    if(servers.length > 0) {
      servers.map((server: any) => {
        console.log("Server: " + server.url);
        request.get(server.url, {method: 'GET'}, (error: any, response: any, body: any) => {
          if(parseInt(response.statusCode) !== 200) {
            console.log(error)
            console.log("Server is down");
            server.is_up = false;
          }else{
            console.log("Server is up");
            server.is_up = true;
          }
          server.last_update = new Date().toLocaleString();
          setServers([...servers]);
        });
      });
    }else{
      console.log("No servers to check");
    }
  }

  return (
    <div>
      
    </div>
  );
}

export default App;
