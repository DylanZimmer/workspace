import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BasePage from './BasePage';
import Workspace from './Workspace';
import { fetchAllGraphFiles } from './services/api';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <BasePage/> } />
        <Route path="/Workspace" element={ <Workspace/> } />
      </Routes>
    </Router>
  );
}

export default App;