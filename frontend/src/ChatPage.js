import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from './Chat';

function ChatPage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : [];
  });


  const friend = friends.find(f => f.username === friendId);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {friend ? friend.name : 'Unknown User'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Chat gallId={friendId} name={friend ? friend.name : 'Unknown User'} />
    </div>
  );
}

export default ChatPage;