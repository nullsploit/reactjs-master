import React, { useState, useEffect } from 'react';
import './App.css';

const request = require('request');


function App() {
  const [selectedServer, setSelectedServer] = useState(null as any);
  const [healthPayload, setHealthPayload] = useState(null as any);
  const [servers, setServers] = useState([
    {
      url: "https://www.stackworx.io",
      display_url: "stackworx.io",
      is_up: false,
      last_update: "unknown",
      color_class: "card-unknown",
      status_code: null,
      payload: null,
    },{
      url: "https://status.gitlab.com/",
      display_url: "status.gitlab.com",
      is_up: false,
      last_update: "unknown",
      color_class: "card-unknown",
      status_code: null,
      payload: null,
    },{
      url: "https://dev.vantage.run/health",
      display_url: "dev.vantage.run",
      is_up: false,
      last_update: "unknown",
      color_class: "card-unknown",
      status_code: null,
      payload: null,
    }
  ] as any);

  useEffect(() => {
    let update_frequency_minutes = 1;
    let update_frequency_seconds = update_frequency_minutes * 60;
    let update_frequency_milliseconds = update_frequency_seconds * 1000;
    console.log("UPDATE FREQ (MIN):", update_frequency_minutes);
    setInterval(() => {
      checkServers();
    }, update_frequency_milliseconds);
  }, []);


  const checkServers = () => {
    console.log("Running checkServers");
    if(servers.length > 0) {
      servers.map((server: any) => {
        console.log("Server: " + server.url);
        try {
          request.get(server.url, {method: 'GET'}, (error: any, response: any, body: any) => {
            if(response) {
              if(parseInt(response.statusCode) !== 200) {
                console.log(error)
                console.log("Server is down");
                server.is_up = false;
                server.color_class = "card-err";
              }else{
                console.log("Server is up");
                server.is_up = true;
                server.color_class = "card-ok";
                server.payload = body;
              }
              server.last_update = new Date().toLocaleString();
              if(server.url === "https://dev.vantage.run/health") {
                setHealthPayload(body);
              }
              setServers([...servers]);
            }else{
              server.error = true
              server.color_class = "card-unknown";
              setServers([...servers]);
            }
          });
        }
        catch(err) {
          server.error = true
          server.color_class = "card-unknown";
          setServers([...servers]);
        }
        
      });
    }else{
      console.log("No servers to check");
    }
  }


  const cardClicked = (server: any) => {
    if(selectedServer === server) {
      setSelectedServer(null);
    }else {
      setSelectedServer(server);
    }
  }

  return (
    <div className="main-container">
      <ul className="cards">
        {servers.map((server: any, index: number) => {
          return (
            <div onClick={() => cardClicked(server)} key={index} className={`card ${server.color_class}`}>
              <h2 className='card__title'>{server.display_url}</h2>
              {
                selectedServer && selectedServer === server?
                <p className='card__text'>{server.is_up?server.last_update:null}</p>
                :null
              }
            </div>
          );
        })}
      </ul>
      {
        selectedServer && healthPayload?
          <div style={{color: "teal", padding: "10px"}}>
            <p>HealthPayload: {healthPayload}</p>
          </div>
        :null
      }
    </div>
  );
}

export default App;
