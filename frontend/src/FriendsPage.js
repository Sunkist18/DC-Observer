import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘 추가
import { Link } from 'react-router-dom';

const initialFriends = [
  { id: 1, name: '채팅방은 개인 기기에만 생성되며, 다른 사람들에게는 보여지지 않습니다.', username: 'backend' },
  { id: 2, name: '우측 상단의 플러스 버튼을 통해 갤러리 채팅방을 만들 수 있습니다.', username: 'backend' },
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

  const handleDeleteFriend = (id, event) => {
    event.stopPropagation(); // 이벤트 전파를 막기 위해 stopPropagation 사용
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
          <ListItem button component={Link} to={`/chat/${friend.username}`} key={friend.id}>
            <ListItemAvatar>
              <Avatar>{friend.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.name} secondary={friend.username} />
            <IconButton edge="end" color="inherit" aria-label="delete" onClick={(event) => handleDeleteFriend(friend.id, event)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>갤러리 추가</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="채팅방 이름"
            type="text"
            fullWidth
            value={newFriend.name}
            onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="갤러리 아이디"
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