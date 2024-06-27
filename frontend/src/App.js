import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import './App.css';

function Chat() {
  const { gallId } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState({ status: false, message: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (gallId) => {
    try {
      let response = await axios.get(`/api/posts/${gallId}`);
      setMessages(response.data);
      setError({ status: false, message: '' }); // Reset error state on successful fetch
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        if (error.response.status === 404) {
          setError({ status: true, message: '갤러리 아이디가 틀렸을 수 있습니다.' });
        } else if (error.response.status === 500) {
          setError({ status: true, message: '서버에 오류가 있습니다.' });
        } else {
          setError({ status: true, message: '알 수 없는 오류가 발생했습니다.' });
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        setError({ status: true, message: '네트워크 오류가 발생했습니다.' });
      }
    }
  };

  useEffect(() => {
    fetchMessages(gallId); // Fetch immediately on mount

    const interval = setInterval(() => {
      fetchMessages(gallId);
    }, 1000);

    return () => clearInterval(interval);
  }, [gallId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRecommendationClass = (recommendation) => {
    return `recommendation-${Math.min(Math.max(recommendation, 0), 10)}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DC inside Chat</h1>
      </header>
      <div className="chat-container">
        {error.status ? (
          <div className="error-message">
            <p className="error-text">{error.message}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${getRecommendationClass(msg.추천 + msg.댓글수)}`}>
              <img src={msg.이미지} alt={`${msg.글쓴이}'s profile`} className="profile-pic" />
              <div className="message-content">
                <div className="message-header">
                  <span className="message-name">{msg.글쓴이}</span>
                  <span className="message-time">{msg.작성일}</span>
                </div>
                <div className="message-text">{msg.제목}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function GallIdForm() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/${inputValue}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DC inside Chat</h1>
        <form onSubmit={handleSubmit} className="gall-id-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter gall_id"
          />
          <button type="submit">Fetch</button>
        </form>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GallIdForm />} />
        <Route path="/:gallId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
