import React, {useState, useEffect} from 'react';
// import LabelWrapper from './components/LabelWrapper';
import { subscribeToTimer } from './api';

function App() {
  const [timestamp, setTimestamp] = useState("no timestamp yet")

  useEffect(() => {
    subscribeToTimer((err, timestamp) => {
      setTimestamp(timestamp)
      // console.log(timestamp, 'timestamp')
    });
  },[])
  
  return (
    <div className="App">
      {/* <LabelWrapper /> */}
       <p className="App-intro">
      This is the timer value: {timestamp}
      </p>
    </div>
  );
}

export default App;
