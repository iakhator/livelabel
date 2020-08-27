import React, {useEffect } from 'react';
import LabelWrapper from './components/LabelWrapper';
// const redis = require("redis");
// const client = redis.createClient('aws:elasticache:us-east-2:396647905834:replicationgroup:rushlabel');

function App() {

  return (
    <div className="App">
      <LabelWrapper />
    </div>
  );
}

export default App;
