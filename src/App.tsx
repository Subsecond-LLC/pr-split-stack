import HomeScreen from './screens/HomeScreen';
import SplitScreen from './screens/SplitScreen';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<HomeScreen />} path="/" />
          <Route
            element={<SplitScreen />}
            path="/:userName/:repoName/pull/:prNumber"
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
