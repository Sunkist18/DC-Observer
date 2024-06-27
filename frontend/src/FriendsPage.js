import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
import { Link } from 'react-router-dom';

const initialFriends = [
  { id: 1, name: '겐지 갤러리', username: 'owgenji' },
  { id: 2, name: '국내야구 갤러리', username: 'baseball_new11' },
];

function FriendsPage() {
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem('friends');
    if (savedFriends) {
      return JSON.parse(savedFriends);
    }
    return initialFriends;
  });

  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  const [open, setOpen] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', username: '' });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewFriend({ name: '', username: '' });
  };

  const handleAddFriend = () => {
    setFriends([...friends, { id: friends.length + 1, name: newFriend.name, username: newFriend.username }]);
    handleClose();
  };

  const handleDeleteFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            디시인사이드 채팅입니다!
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend.id}>
            <ListItemAvatar>
              <Avatar>{friend.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={friend.name}
              secondary={friend.username}
              component={Link} to={`/chat/${friend.username}`}
            />
            <IconButton edge="end" color="inherit" aria-label="delete" onClick={() => handleDeleteFriend(friend.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>친구 추가</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="이름"
            type="text"
            fullWidth
            value={newFriend.name}
            onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="아이디"
            type="text"
            fullWidth
            value={newFriend.username}
            onChange={(e) => setNewFriend({ ...newFriend, username: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleAddFriend} color="primary">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FriendsPage;