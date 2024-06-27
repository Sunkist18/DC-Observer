import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./App.css"

function Chat({ name, gallId }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState({ status: false, message: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (gallId) => {
    try {
      let response = await axios.get(`http://5.104.84.170:5000/api/posts/${gallId}`);
      setMessages(response.data);
      setError({ status: false, message: '' });
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setError({ status: true, message: '갤러리가 존재하지 않습니다' });
        } else if (error.response.status === 500) {
          setError({ status: true, message: '서버에서 오류가 발생했습니다.' });
        } else {
          setError({ status: true, message: '알 수 없는 오류가 발생했습니다.' });
        }
      } else {
        setError({ status: true, message: '네트워크 오류가 발생했습니다.' });
      }
    }
  };

  useEffect(() => {
    if (gallId) {
      fetchMessages(gallId);
      const interval = setInterval(() => {
        fetchMessages(gallId);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gallId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRecommendationClass = (recommendation) => {
    return `recommendation-${Math.min(Math.max(recommendation, 0), 10)}`;
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => window.history.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="chat-container">
        {error.status ? (
          <div className="error-message">
            <p className="error-text">{error.message}</p>
          </div>
        ) : (
          Array.isArray(messages) && messages.length > 0 ? (
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
          ) : (
            <div className="no-messages">
              <p>No messages to display.</p>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;