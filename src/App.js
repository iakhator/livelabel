import React from 'react';
import LabelWrapper from './components/LabelWrapper';

function App() {

  // useEffect(() => {
  //   subscribeToTimer((err, timestamp) => {
  //     setTimestamp(timestamp)
  //     console.log(timestamp, 'timestamp')
  //   });
  // },[])
  
  return (
    <div className="App">
      <LabelWrapper />
       {/* <p className="App-intro">
      This is the timer value: {timestamp}
      </p> */}
    </div>
  );
}

export default App;
