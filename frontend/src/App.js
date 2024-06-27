import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FriendsPage from './FriendsPage';
import ChatPage from './ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FriendsPage />} />
        <Route path="/chat/:friendId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
