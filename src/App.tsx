import React, { useState, useEffect } from 'react';

const request = require('request');

// declare all servers to check
const urls = [
  "https://stackworx.io/",
  "https://dev.vantage.run/health",
  "https://status.gitlab.com/",
]


function App() {

  const [servers, setServers] = useState([] as Array<any>);

  useEffect(() => {
    initServers();
  }, []);

  const initServers = () => {
    let servers = [] as Array<any>;
    urls.forEach(url => {
      servers.push({
        url: url,
        is_up: false,
        last_update: "unknown",
      })
    });
    setServers(servers);
  }

  return (
    <div>
      
    </div>
  );
}

export default App;
