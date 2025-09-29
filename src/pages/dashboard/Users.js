import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from Realtime Database...');
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = [];
          const data = snapshot.val();
          
          console.log('Raw data from database:', data);
          
          // Convert object to array
          Object.keys(data).forEach((uid) => {
            console.log('User document:', uid, data[uid]);
            usersData.push({ id: uid, ...data[uid] });
          });
          
          // Sort by signup time (newest first)
          usersData.sort((a, b) => {
            const timeA = a.signupTime || 0;
            const timeB = b.signupTime || 0;
            return timeB - timeA; // Newest first
          });
          
          console.log('Total users fetched:', usersData.length);
          setUsers(usersData);
        } else {
          console.log('No users found in database');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // In Realtime Database, serverTimestamp() returns a number (milliseconds)
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>
            All Users
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/welcome')}>
              Back to Welcome
            </Button>
            <Button variant="contained" onClick={() => navigate('/app')}>
              Go to Chat
            </Button>
          </Stack>
        </Stack>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Signup Time</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.signupTime)}</TableCell>
                    <TableCell>
                      {user.uid === currentUser?.uid ? (
                        <Chip label="You" color="primary" size="small" />
                      ) : (
                        <Chip label="Active" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {users.length === 0 && (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No users found.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UsersPage;