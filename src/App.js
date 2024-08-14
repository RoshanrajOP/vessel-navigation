import React from 'react';
import './App.css';
import VesselNavigation from './components/VesselNavigation';

function App() {
  return (
    <div className="App">
      <VesselNavigation
        start={[22.1696, 91.4996]}
        end={[22.2637, 91.7159]}
        speed={20}
      />
    </div>
  );
}

export default App;
